import cloudinaryUploadImg,{cloudinaryDeleteImg} from '../utils/cloudinary.js'
import fs from 'fs'
import asyncHandler from 'express-async-handler'

export const uploadImages = asyncHandler(async(req,res)=>{
    try {
        const uploader = (path)=>cloudinaryUploadImg(path,"images")
        const urls = []
        const files = req.files
        console.log(files)
        for(const file of files){
            const {path} = file;
            const newpath = await uploader(path)
            urls.push(newpath)
            fs.unlinkSync(path)
        }
        const images = urls.map(file=>{return file})
        res.json(images)
        
    } catch (error) {
        throw new Error(error)
    }
})

// delete Images

export const deleteImages = asyncHandler(async(req,res)=>{
    const {id} = req.params
    try {
        const deleteImage = await cloudinaryDeleteImg(id,'images')
        res.json({message:"Deleted"})
       
    } catch (error) {
        throw new Error(error)
    }
})