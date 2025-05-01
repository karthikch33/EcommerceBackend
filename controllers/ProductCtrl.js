import exModel from "../models/ProductModel2.js";
import User from '../models/UserModel.js'
import asyncHandler from 'express-async-handler'
import slugify from "slugify";

//create product
export const createProduct = asyncHandler(async(req,res)=>{
   try {
        if(req.body.title){
        req.body.slug = slugify(req.body.title)  // makes lower and hypen seperated slugs
        const newProduct = await exModel.create(req.body)
        res.json(newProduct)    
        }
   } catch (error) {
    throw new Error(error)
   }
})

// get a product 
export const getaProduct = asyncHandler(async (req,res)=>{
    const {id} = req.params
    try {
        if(!id) throw new Error('Id Not Found')
        const getProduct =await exModel.findById(id).populate('color');
        res.json(getProduct)
    } catch (error) {
        throw new Error(error)
    }
})

// get all products

export const getAllProducts = asyncHandler(async (req,res)=>{
    try {
        //Filtering
        const queryObj = {...req.query}
        const excludeFields = ['sort','page','limit','fields']
        excludeFields.forEach(el=>delete queryObj[el])

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`)
        let query = exModel.find(JSON.parse(queryStr))
        
        //Sorting

        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy); 
        }
        else{
            query = query.sort('-createdAt')
        }

        // Limiting the Fields

        // if(req.query.fields){
        //     const fields = req.query.fields.split(',').join(' ')
        //     query = query.select(fields)
        // }else{
        //     query = query.select('__v')
        // }


        // Pagination

       

        if(req.query.page && req.query.limit){

            const page = req.query.page;
            const limit = req.query.limit;
            const skip = (page - 1) * limit
            
            const productCount = await exModel.countDocuments()
            if(skip >= productCount) throw new Error('This Page does not exist')
            
            query = query.skip(skip).limit(limit)
        }

        const product = await query;
        res.json(product)

    } catch (error) {
        throw new Error(error)
    }
})

// updating a product

export const updateProduct = asyncHandler(async (req,res)=>{
    try {
        const {id} = req.params;
        if(!id) throw new Error('Id Not Found')
        if(req.body.title) req.body.slug = slugify(req.body.title)
        const updateaProduct =await exModel.findByIdAndUpdate(id,req.body,{new:true})
        res.json(updateaProduct)
    } catch (error) {
        throw new Error(error)
    }
})


// delete a product

export const deleteProduct = asyncHandler(async (req,res)=>{
    try {
        const {id} = req.params
        if(!id) throw new Error('Id Not Found')
        const deleteaProduct =await exModel.findByIdAndDelete(id);
        res.json(deleteaProduct)
    } catch (error) {
        throw new Error(error)
    }
})



// add wishlist 

export const addToWishList = asyncHandler(async(req,res)=>{
    const {_id} = req?.user;
    const {prodId} = req?.body;
    try {
        const user = await User.findById(_id).populate('wishlist');
        const alreadyAdded = user.wishlist.find((id)=>id?._id.toString() === prodId)
        if(alreadyAdded){
            let user = await User.findByIdAndUpdate(_id,{$pull:{wishlist:prodId}},{new:true});
            res.json({status :'Removed from Wishlist'})
        }   
        else{
            let user = await User.findByIdAndUpdate(_id,{$push:{wishlist:prodId}},{new:true})
            res.json({status: 'Added to Wishlist'})
        }
    } catch (error) {
        throw new Error(error)
    }
})


// rating 

export const rating = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    const {star,prodId,comment} = req.body

    try {
        const product = await exModel.findById(prodId)
        let alreadyRated = product.ratings.find((userId)=>userId.postedby.toString() === _id.toString())
        if(alreadyRated){
            const updaterating = await exModel.updateOne(
            {
                ratings: {$eleMatch:alreadyRated}
            },{
                $set:{"ratings.$.star":star,"ratings.$.comment":comment}
            },{
                new:true
            }
        )
        res.json(updaterating)
        }
        else{
            const rateProduct = await exModel.findByIdAndUpdate(prodId,{
                $push:{
                        ratings:{star:star,comment:comment,postedby:_id}
                      }
            },{new:true})
          res.json(rateProduct)
        }

        const getallratings = await exModel.findById(prodId)
        let totalrating = getallratings.ratings.length;
        let ratingsum = getallratings.ratings.map((item)=>item.star).reduce((prev,curr)=>prev+curr,0)
        let actualRating = Math.round(ratingsum/totalrating)
        const productFinal = await exModel.findByIdAndUpdate(prodId,{
            totalrating:actualRating
        },{new:true})

        res.json(productFinal)
    } catch (error) {
        throw new Error(error)
    }
})


