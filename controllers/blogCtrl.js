import Blog from '../models/blogModel.js'
import User from '../models/UserModel.js'
import cloudinaryUploadImg from '../utils/cloudinary.js'
import validateMongoDbId from '../utils/validateMongodbId.js'
import asyncHandler from 'express-async-handler'
import fs from 'fs'


export const createBlog = asyncHandler(async(req,res)=>{
    try {
        const newBlog = await Blog.create(req.body);
        res.json({
            status:"Success",
            newBlog
        })
    } catch (error) {
        throw new Error(error)
    }
})

export const updateBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id,req.body,{new:true})
        res.json(updateBlog)
    } catch (error) {
        throw new Error(error)
    }
})

export const getBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params
    try {
        const getBlog = await Blog.findById(id).populate('likes').populate('dislikes');
        if(!getBlog) throw new Error('Blog Not Found')

        const updateViews = await Blog.findByIdAndUpdate(id,{
            $inc:{numViews:1}  // increment function in mongodb
        },{new:true})
        res.json(getBlog)
    } catch (error) {
        throw new Error(error)
    }
})

export const getAllBlogs = asyncHandler(async (req,res)=>{
    try {
            const allBlogs = await Blog.find()
            res.json(allBlogs)
    } catch (error) {
        throw new Error(error)
    }
})

export const deleteBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try {
        const findUser = await Blog.findById(id)
        if(!findUser) throw new Error('User Not Found')
        
        const deletedUser = await Blog.findByIdAndDelete(id)
        res.json(deletedUser)

    } catch (error) {
        throw new Error(error)
    }
})


export const likeBlog = asyncHandler(async(req,res)=>{
    const {blogId} = req.body;
    validateMongoDbId(blogId)

    // find the blog which you want to be like now 
    const blog = await Blog.findById(blogId)
    // find the login user 
    const loginUserId = req?.user?._id;
    // find the user is liked the post
    const isLiked = blog?.isLiked;
    // find the user if he disliked the post
    const alreadyDisliked = blog?.dislikes?.find((userId)=>userId.toString() === loginUserId.toString())

    if(alreadyDisliked){
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $pull:{dislikes:loginUserId},
            isDisliked:false
        },{new:true})
        res.json(blog)
    }

    if(isLiked)
    {
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $pull:{likes:loginUserId},
            isLiked:false
        },{new:true})
        res.json(blog)
    }
    else{
        const blog = await Blog.findByIdAndUpdate(blogId,{
            $push:{likes:loginUserId},
            isLiked:true
        },{new:true})
        res.json(blog)
    }


})

export const dislikeBlog = asyncHandler(async(req,res)=>{
    const {blogId} = req.body
    validateMongoDbId(blogId)

    //find the blog which you want to dislike now
    const blog = await Blog.findById(blogId)
    // find the login user now 
    const loginUserId = req?.user?._id;
    // find the status of the blog
    const isDisliked = blog?.isDisLiked;
    // find the user if he liked the post 
    const alreadyLiked =  blog?.likes?.find((userId)=>userId.toString() === loginUserId.toString())

    if(alreadyLiked){
        const blog =await Blog.findByIdAndUpdate(blogId,{
            $pull:{likes:loginUserId},
            isLiked:false
        },{new:true})
        res.json(blog)
    }


    if(isDisliked){
        const blog =await Blog.findByIdAndUpdate(blogId,{
            $pull:{dislikes:loginUserId},
            isDisliked:false
        },{new:true})
        res.json(blog)
    }
    else{
        const blog =await Blog.findByIdAndUpdate(blogId,{
            $push:{dislikes:loginUserId},
            isDisLiked:true
        },{new:true})
        res.json(blog)
    }

})


export const uploadImages = asyncHandler(async(req,res)=>{
    const {id} = req.params
    try {
        const uploader = (path)=> cloudinaryUploadImg(path, 'images')
        const urls = []
        const files = req.files
        for(const file of files){
            const {path} = file
            const newpath = await uploader(path)
            urls.push(newpath)
            fs.unlinkSync(path)
        }
        const findBlog = await Blog.findByIdAndUpdate(id,{
            images:urls.map((file)=>{
                return file;
            })
        },{new:true})
        res.json(findBlog)
    } catch (error) {
        throw new Error(error)
    }
})

