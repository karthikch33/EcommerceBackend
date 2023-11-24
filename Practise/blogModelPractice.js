import asyncHandler from 'express-async-handler'
import cryto from 'crypto'
import Blog from '../models/blogModel.js'
import User from '../models/UserModel.js';



export const createBlog = asyncHandler(async(req,res)=>{
    const blog = Blog.create(req.body);
    res.json(blog)
})

export const updateBlog = asyncHandler(async(req,res)=>{
    const {email} = req.body;
    if(!email) throw new Error('email Not Found')

    const blog =await Blog.findOneAndUpdate({email},req.body,{new:true})
    res.json(blog)
})

export const deleteBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    if(!id) throw new Error('Id Requiredd')

    const blog = await Blog.findByIdAndDelete(id)
    if(!blog) throw new Error('Your Blog is not find')
    
    res.json(blog)
})

export const getBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params
    if(!id) throw new Error('Id required')

    const blog = await Blog.findByIdAndUpdate(id,{$inc:{numsViews:1}},{new:true})

    // const blog2 = await Blog.findByIdAndUpdate(id,{$inc:{numViews:1}},{new:true})

    if(!blog) throw new Error(blog)

    res.json(blog)

})

export const getAllBlogs = asyncHandler(async(req,res)=>{
    const allBlogs = await Blog.find()
    if(allBlogs) throw new Error('No Blogs Found')
    res.json(allBlogs)
})

export const likeBlog = asyncHandler(async(req,res)=>{
    const {blogId} = req.body;
    const blog = await Blog.findById(blogId)

    const currentUserId = req?.user?._id;

    const user = await User.findById(currentUserId)

    if(!user) throw new Error('user not found')

    const isLiked = Blog?.isLiked

    const alreadyDisliked = blog?.dislikes?.find((userId)=>userId.toString() === currentUserId.toString())

    if(alreadyDisliked){
        const blogretrivefordislikerm = await Blog.findByIdAndUpdate(blogId,{$pull:{dislikes:currentUserId},isLiked:false},{new:true})
        res.json(blogretrivefordislikerm)
    }

    if(isLiked)
    {
        const blogretrivefordislikerm = await Blog.findByIdAndUpdate(blogId,{$pull:{dislikes:currentUserId},isLiked:false},{new:true})
        res.json(blogretrivefordislikerm)
    }
    else{
        const blogretriveforaddlike = await Blog.findByIdAndUpdate(blogId,{$push:{likes:currentUserId},isLiked:true},{new:true})
        res.json(blogretriveforaddlike)
    }

})


export const dislikeBlog = asyncHandler(async(req,res)=>{
    const {blogId} = req.body;
    if(!blogId) throw new Error('Blog Id Not Found')

    // current user id
    const currentUserId = req?.user?._id
    // fetching the required user 
    // fetching the required blog
    const requiredBlog =await  Blog.findById(blogId)

    const isDisLiked = requiredBlog?.isDisLiked;

    // checking if he already liked the blog 
    const alreadyLiked = requiredBlog?.likes?.find((userId)=>userId.toString()  === currentUserId.toString())

    if(alreadyLiked)
    {
        //removing from likes array 
        const requiredBlog = await Blog?.findByIdAndUpdate(blogId,{$pull:{likes:currentUserId},isDisliked:false})
        res.json(requiredBlog)
    }
    
    if(isDisLiked)
    {
        const requiredBlog = await Blog?.findByIdAndUpdate(blogId,{$pull:{dislikes:currentUserId},isDisLiked:false})
        res.json(requiredBlog)
    }
    else{
        const requiredBlog = await Blog?.findByIdAndUpdate(blogId,{$push:{dislikes:currentUserId},isDisLiked:true})
        res.json(requiredBlog)
    }
})