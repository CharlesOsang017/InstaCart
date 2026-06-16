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
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({message:"All fields are required"})
    }
    const existingUser = await prisma.user.findUnique({where:{email}})
    if(existingUser){
        return res.status(400).json({message:"User already exists"})
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

}

// POST /api/auth/login
export const login = async(req:Request, res:Response)=>{
    
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({message:"All fields are required"})
        }
        const user = await prisma.user.findUnique({where:{email}})
        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(401).json({message:"Invalid email or password"})
        }

        const token = generateToken(user.id);
        const userData: any = {...user}
        delete userData.password;
        userData.isAdmin = getAdminStatus(userData.email);

        res.status(200).json({
            message:"User logged in successfully",
            token,
            user:userData
        })
        
    }