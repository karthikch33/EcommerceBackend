import ColorSch from "../models/colorModel.js";
import asyncHandler from 'express-async-handler'

export const createColor = asyncHandler(async(req,res)=>{
    try {
        const createdColor = await ColorSch.create(req.body);
        if(createdColor) res.json(createdColor);
    } catch (error) {
        throw new Error(error)
    }
})


export const updateColor = asyncHandler(async(req,res)=>{
    try {
        const {id} = req.params
        if(!id) throw new Error('Id Required...')
        const findColor = await ColorSch.findByIdAndUpdate(id,req.body,{new:true})
        if(findColor) res.json(findColor)
        
    } catch (error) {
        throw new Error(error)
    }
    
})


export const deleteColor = asyncHandler(async(req,res)=>{
    try {
        const {id} = req.params
        if(!id) throw new Error('Id Required....')
        const findColor = await ColorSch.findByIdAndDelete(id);
        if(findColor) res.json(findColor)
    } catch (error) {
        throw new Error(error)
    }
})

export const getColor = asyncHandler(async(req,res)=>{
    try {
        const {id} = req.params
        if(!id) throw new Error('Id Required....')
        const findColor = await ColorSch.findById(id);
        if(!findColor) throw new Error('Record Not Found In Our Records...')
        res.json(findColor)

    } catch (error) {
        throw new Error(error)
    }
})

export const getAllColors = asyncHandler(async(req,res)=>{
    try {
        const findAllColors = await ColorSch.find();
        if(!findAllColors) throw new Error('Not Found Any Colors')
        res.json(findAllColors)
    } catch (error) {
        throw new Error(error)
    }
})