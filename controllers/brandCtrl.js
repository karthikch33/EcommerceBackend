import brand from '../models/brandModel.js'
import asyncHandler from 'express-async-handler'
import validateMongoDbId from '../utils/validateMongodbId.js';

export const createBrand = asyncHandler(async(req,res)=>{
    try {
        const newBrand = await brand.create(req.body);
        res.json(newBrand)
    } catch (error) {
        throw new Error(error)
    }
})

export const updateBrand = asyncHandler(async(req,res)=>{
    const {id} = req.params
    try {
        const updationBrand = await brand.findByIdAndUpdate(id,req.body,{new:true})
        res.json(updationBrand)
    } catch (error) {
        throw new Error(error)
    }
})

export const deleteBrand = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try {
        const delBrand = await brand.findByIdAndDelete(id)
        if(!delBrand) throw new Error('Brand Not Found')
        res.json(delBrand)
    } catch (error) {
        throw new Error(error)
    }
})

export const getBrand = asyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const Brand = await brand.findById(id)
        if(!Brand) throw new Error('There is No Brand')
        res.json(Brand)
    } catch (error) {
        throw new Error(error)
    }
})

export const getallBrand = asyncHandler(async(req,res)=>{
    try {
        const allBrands = await brand.find()
        res.json(allBrands)
    } catch (error) {
        throw new Error(error)
    }
})

