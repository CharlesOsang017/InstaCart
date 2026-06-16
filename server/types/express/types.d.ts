import {User, DeliveryPartner } from "../../generated/prisma/index.js"

declare global {
    namespace Express {
        interface Request {
            user?: {id: string, isAdmin?: boolean}
            partner?: DeliveryPartner
        }
    }
}

export {};