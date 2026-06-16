import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const authMiddleware = (req:Request, res:Response, next:NextFunction)=>{
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({message: "No token provided, authorization denied"})
        }
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as {id: string};
        req.user = {id: decodedToken.id};
        next();
    } catch (error) {
        console.log(error);
        return  res.status(500).json({message: "Internal server error"})
    }
}
    
export default authMiddleware;