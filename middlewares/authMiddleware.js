import User from '../models/UserModel.js'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'


export const authMiddleWare = asyncHandler(async (req,res,next)=>{
    const tokenavl = req.headers.authorization?.startsWith('Bearer')
    if(tokenavl){
        const token = req.headers.authorization.split(" ")[1];
        try {
            if(token){
                const decode = jwt.verify(token,process.env.JWT_SECRET)
                const user = await User.findById(decode?.id)
                req.user = user
                next()
            }
        } catch (error) {
            throw new Error(`Not Authorized Token expired, Please Login Again`)
        }
    }else{
        throw new Error(`There is no token attached to the headers`)
    }
})

export const isAdmin = asyncHandler(async (req,res,next)=>{
    const email = req.user.email

    const adminUser = await User.findOne({email})

    if(adminUser.role !== 'admin'){
        throw new Error(`You are not an Admin`)
    }
    else{
        next()
    }
})