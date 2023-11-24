import EnquirySch from "../models/enqModel.js";
import asyncHandler from 'express-async-handler'

export const createEnquiry = asyncHandler(async(req,res)=>{
    try {
        const createdEnquiry = await EnquirySch.create(req.body);
        if(createdEnquiry) res.json(createdEnquiry);
    } catch (error) {
        throw new Error(error)
    }
})

export const updateEnquiry = asyncHandler(async(req,res)=>{
    try {
        const {id} = req.params
        if(!id) throw new Error('Id Required...')
        const findEnquiry = await EnquirySch.findByIdAndUpdate(id,req.body,{new:true})
        if(findEnquiry) res.json(findEnquiry)
        
    } catch (error) {
        throw new Error(error)
    }
    
})


export const deleteEnquiry = asyncHandler(async(req,res)=>{
    try {
        const {id} = req.params
        if(!id) throw new Error('Id Required....')
        const findEnquiry = await EnquirySch.findByIdAndDelete(id);
        if(findEnquiry) res.json(findEnquiry)
    } catch (error) {
        throw new Error(error)
    }
})

export const getEnquiry = asyncHandler(async(req,res)=>{
    try {
        const {id} = req.params
        if(!id) throw new Error('Id Required....')
        const findEnquiry = await EnquirySch.findById(id);
        if(!findEnquiry) throw new Error('Record Not Found In Our Records...')
        res.json(findEnquiry)

    } catch (error) {
        throw new Error(error)
    }
})

export const getallEnquiry = asyncHandler(async(req,res)=>{
    try {
        const findAllEnquirys = await EnquirySch.find();
        if(!findAllEnquirys) throw new Error('Not Found Any Enquirys')
        res.json(findAllEnquirys)
    } catch (error) {
        throw new Error(error)
    }
})