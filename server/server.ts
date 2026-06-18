import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cors from "cors";
import uploadRoutes from "./routes/upload.route.js";
import orderRoutes from "./routes/order.route.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import addressRoutes from "./routes/address.route.js";
import adminRoutes from "./routes/admin.route.js";

const app = express();

// Middleware
app.use(cors())
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/addresses", addressRoutes)
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/admin", adminRoutes)
const port = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});
// Error handling
app.use((error: any, req: Request, res: Response, next: NextFunction)=>{
    console.log(error);
    return res.status(500).json({message: error.message})
})
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});