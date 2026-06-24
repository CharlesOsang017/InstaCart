import { Request, Response } from "express";
import { prisma } from "../config/prisma.js"

// GET /api/products/flash-deal
export const getFlashDeals = async(req:Request, res:Response)=>{
    const products = await prisma.product.findMany({
        where:{stock: {gt:0}},
        orderBy:{originalPrice:"desc"}
    })
    const productsWithDiscount = products.map((product:any)=>{
        const discount = product.originalPrice && product.price ? Math.round(((product.originalPrice - product.price)/product.originalPrice)*100) : 0;
        return {...product, discount}
    })
    res.json({products:productsWithDiscount.slice(0,8)})
}
// GET/api/products/

export const getProducts = async(req: Request, res: Response)=>{
    const {category, search, minPrice, maxPrice, sort, organic, page = "1", limit = "12"} = req.query;

    const where: any = {};

    if(category && category  !== "all") where.category = category as string;
    if(search) where.name = {contains: search as string, mode: "insensitive"};
    
    if(organic === "true") where.isOrganic = true;

    if(minPrice || maxPrice){
        where.price ={};
        if(minPrice) where.price.gte = Number(minPrice);
        if(maxPrice) where.price.lte = Number(maxPrice);
    }

    let orderBy: any = {};
    switch (sort) {
        case "price_asc":
            orderBy = { price: "asc" };
            break;
        case "price_desc":
            orderBy = { price: "desc" };
            break;
        case "rating":
            orderBy = { rating: "desc" };
            break;
        case "name":
            orderBy = { name: "asc" };
            break;
        default:
            orderBy = { createdAt: "desc" };
            break;
    }

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 12;
    const skip = (pageNum - 1) * limitNum;

    const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy,
            skip,
            take: limitNum,
        }),
        prisma.product.count({ where })
    ]);

    const productsWithDiscount = products.map((product:any)=>{
        const discount = product.originalPrice && product.price ? Math.round(((product.originalPrice - product.price)/product.originalPrice)*100) : 0;
        return {...product, discount}
    })

    res.json({
        products: productsWithDiscount,
        totalProducts: totalCount,
        totalPages: Math.ceil(totalCount / limitNum),
        currentPage: pageNum
    })
}

// GET/api/products/:id
export const getProduct = async(req:Request, res:Response)=>{
    const {id} = req.params as {id: string};
    const product = await prisma.product.findUnique({
        where: {id},
    })
    if(!product){
        return res.status(404).json({message: "Product not found"})
    }
    const discount = product.originalPrice && product.price ? Math.round(((product.originalPrice - product.price)/product.originalPrice)*100) : 0;
    res.json({product: {...product, discount}})
}

// POST /api/products
export const createProduct = async(req:Request, res:Response)=>{
    const product = await prisma.product.create({data: req.body})
    res.status(201).json({product})
}

// PUT /api/products/:id
export const updateProduct = async(req:Request, res:Response)=>{
    const {id} = req.params as {id: string};
    const product = await prisma.product.update({
        where: {id},
        data: req.body,
    })
    res.status(200).json({product})
}

// DELETE /api/products/:id
export const deleteProduct = async(req:Request, res:Response)=>{
    const {id} = req.params as {id: string};
    await prisma.product.delete({
        where: {id},
    })
    res.status(200).json({message: "Product deleted successfully"})
}