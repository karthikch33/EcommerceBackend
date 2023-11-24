import asyncHandler from "express-async-handler";
import exModel from "../models/ProductModel2.js";
import slugify from "slugify";

export const createProduct = asyncHandler(async(req,res)=>{
    const {title} = req.body.title
    req.body.slug = slugify(title)
    try {
        const createUs = exModel.create(req.body);
        if(!createUs) throw new Error('Unable To Create Product')
        res.json(createUs)
    } catch (error) {
        throw new Error(error)
    }
}) // creating product from req.body

export const getProduct = asyncHandler(async (req,res)=>{
    const {id} = req.params
    if(!id) throw new Error('Id Not Found')
    const product = await exModel.findById(id)
    res.json(product)
}) // id from params


export const updateProduct = asyncHandler(async(req,res)=>{
    const {id} = req.params
    try {
        if(!id) throw new Error('Id Not Found')
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
            const updatedProduct = await exModel.findByIdAndUpdate(id,req.body,{new:true})
            res.json(updatedProduct)
        }
    } catch (error) {
        throw new Error(error)
    }
}) // updating the product from req.params

export const deleteProduct = asyncHandler(async(req,res)=>{
    try {
        const {id} = req.params;
        if(!id) throw new Error('Id Not found')
        const product = exModel.findByIdAndDelete(id)
        if(!product) throw new Error('Product Not found')
        res.json(product)
    } catch (error) {
        throw new Error(error)
    }
}) // deleting the product from req.params

export const getAllProducts = asyncHandler(async(req,res)=>{
    // try {
    //     const queryObj = {...req.query}
    //     const excludeFields = []

    //     console.log(queryObj)  // this is actual obj without having excluded files

    //     const queryStr = JSON.stringify(queryObj) // making queryObj which is dicitonary one into string
    //     console.log(queryStr)
    //     // console.log(typeof queryStr)
    //     const replaceStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`) // manipulating the String our own like here we have added the $ symbol at gte|gt|lte|lt

    //     console.log(replaceStr)

    //     console.log(JSON.parse(replaceStr))  // making string to JSON

    //     const allProducts = await exModel.find(JSON.parse(replaceStr));
    //     if(!allProducts) throw new Error('No Products Found')
    //     res.json(allProducts)



    //     // filtering


















    // } 
    
    try{
        const queryObj = {...req.query}
        const excludeFields = ['sort','fields','page','limit']
        excludeFields.forEach(el=>delete queryObj[el])

        // Filtering

        const str = JSON.stringify(queryObj)

        const strreplace = str.replace(/\b(gte|lte|gt|lt)\b /g,match=>`$${match}`)

        const backtoJson = JSON.parse(strreplace)

        let productFind = exModel.find(backtoJson)

        // Sorting

        if(req.query.sort){
            const replacecommajoin = req.query.sort.split(',').join(' ')
            productFind = productFind.sort(replacecommajoin)
        }else{
            productFind = productFind.sort('-createdAt')
        }

        //Limiting The Fields

        if(req.query.fields){
            const replacecommajoin = req.query.fields.split(',').join(' ')
            productFind = productFind.select(replacecommajoin)
        }else{
            productFind = productFind.select('__v')
        }


        // Pagination

        if(req.query.page && req.query.limit){

            const page = req.query.page
            const limit = req.query.limit
            const skip = (page - 1) * limit
            
            const productCount =await exModel.countDocuments()
            if(skip >= productCount) throw new Error('Skip Limit Exceeded')
            productFind = productFind.skip(skip).limit(limit)
        
        }

       

        const query = await productFind;
        res.json(query)

    }
    
    catch (error) {
        throw new Error(error)
    }
})


