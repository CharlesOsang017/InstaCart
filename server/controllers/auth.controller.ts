// Register

import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


// Generate JWT Token
const generateToken = (id:string)=>{
    return jwt.sign({id}, process.env.JWT_SECRET!, {expiresIn:"1d"})
}

// Check if user is admin
const getAdminStatus = (email: string | null | undefined): boolean =>{
    if (!email) return false;
    const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map((e)=>e.trim().toLowerCase()) : [];    
    return adminEmails.includes(email.toLowerCase());
}

// POST /api/auth/register
export const register = async(req:Request, res:Response)=>{
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"})
        }
        const existingUser = await prisma.user.findUnique({where:{email}})
        if(existingUser){
            return res.status(400).json({message:"User already exists with this  email"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data:{
                name,
                email:email.toLowerCase(),
                password:hashedPassword
            }
        })

        const token = generateToken(user.id);
        const userData: any = {...user}
        delete userData.password;
        userData.isAdmin = getAdminStatus(userData.email);

        res.status(201).json({
            message:"User registered successfully",
            token,
            user:userData
        })



        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"})
    }
}