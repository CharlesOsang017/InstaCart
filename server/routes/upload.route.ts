import { Request, Response } from "express";
import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";


const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage});

router.post("/", upload.single("image"), async (req: Request, res: Response)=>{
    try {
        if(!req.file){
            return res.status(400).json({message: "No image file provided"})
        }
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: "grocery-delivery",
            resource_type: "auto",
        });
        res.json({url: result.secure_url})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal server error"})
    }
})

export default router;