import blogCategory from '../models/blogcategoryModel.js'
import asyncHandler from 'express-async-handler'
import validateMongoDbId from '../utils/validateMongodbId.js';

export const createCategory = asyncHandler(async(req,res)=>{
    try {
        const newCategory = await blogCategory.create(req.body);
        res.json(newCategory)
    } catch (error) {
        throw new Error(error)
    }
})

export const updateCategory = asyncHandler(async(req,res)=>{
    const {id} = req.params
    console.log(id)
    try {
        const updationCategory = await blogCategory.findByIdAndUpdate(id,req.body,{new:true})
        res.json(updationCategory)
    } catch (error) {
        throw new Error(error)
    }
})

export const deleteCateogry = asyncHandler(async(req,res)=>{
    const {id} = req.params;

    try {
        const delCateogry = await blogCategory.findByIdAndDelete(id)
        if(!delCateogry) throw new Error('Cateogry Not Found')
        res.json(delCateogry)
    } catch (error) {
        throw new Error(error)
    }
})

export const getCateogry = asyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const category = await blogCategory.findById(id)
        if(!category) throw new Error('There is No Category')
        res.json(category)
    } catch (error) {
        throw new Error(error)
    }
})

export const getallCateogry = asyncHandler(async(req,res)=>{
    try {
        const allCategories = await blogCategory.find()
        res.json(allCategories)
    } catch (error) {
        throw new Error(error)
    }
})

