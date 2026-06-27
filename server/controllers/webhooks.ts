import { Request, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../config/prisma.js";
import { inngest } from "../inngest/index.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const stripewebhook = async(request: Request, response: Response)=>{
    let event: Stripe.Event;
    if(endpointSecret){
        // Get the signature sent by Stripe
        const signature = request.headers['stripe-signature'];
        try {
            event = stripe.webhooks.constructEvent(request.body, signature!, endpointSecret)
        } catch (error: any) {
            console.error(`Webhook signature verification failed: ${error.message}`)
            return response.status(400).send(`Webhook error: ${error.message}`)
        }

        // handle the event
        switch(event.type){
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                const paymentIntentId = paymentIntent.id;

                // Getting Session Metadata
                const session = await stripe.checkout.sessions.list({ payment_intent: paymentIntentId });
                
                if (session.data.length === 0) {
                    console.error(`No session found for payment intent: ${paymentIntentId}`);
                    return response.status(400).send('No session found');
                }

                const { orderId } = session.data[0].metadata || {};
                
                if (!orderId) {
                    console.error(`No orderId in session metadata for payment intent: ${paymentIntentId}`);
                    return response.status(400).send('No orderId in metadata');
                }

                // Mark Payment as Paid
                const paidOrder = await prisma.order.update({
                    where: { id: orderId },
                    data: { isPaid: true, status: 'Paid' }
                })

                // Decrease stock
                const orderItems = (Array.isArray(paidOrder.items) ? paidOrder.items : []) as any[];
                for (const item of orderItems) {
                    await prisma.product.update({
                        where: { id: item.product },
                        data: { stock: { decrement: item.quantity } }
                    })
                }

                // send stock update event for each product in the order
                for (const item of orderItems) {
                    await inngest.send({ name: "inventory/stock.updated", data: { productId: item.product } })
                }

                // send order placed event
                if (paidOrder) {
                    await inngest.send({ name: "order/placed", data: { orderId: paidOrder.id } })
                }

                break;
            }
            case 'payment_intent.canceled':
            case 'payment_intent.payment_failed': {
                const paymentIntentFailure = event.data.object as Stripe.PaymentIntent;
                const paymentIntentFailureId = paymentIntentFailure.id;

                // Getting Session Metadata
                const sessionFailure = await stripe.checkout.sessions.list({
                    payment_intent: paymentIntentFailureId
                })
                
                if (sessionFailure.data.length > 0) {
                    const failureOrderId = sessionFailure.data[0].metadata?.orderId;

                    if (failureOrderId) {
                        await prisma.order.delete({
                            where: { id: failureOrderId }
                        })
                    }
                }
                break;
            }
            default:
                console.log(`Unhandled event type: ${event.type}`)
        }
        // Return a response to acknowledge receipt of the event
        response.json({ received: true })
    } else {
        response.status(400).send('No webhook secret configured');
    }
}