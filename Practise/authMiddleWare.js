import asyncHandler from 'express-async-handler'
import User from '../models/UserModel.js'
import expressAsyncHandler from 'express-async-handler'

export const tokenVerify = asyncHandler(async(req,res,next)=>{
    const token = req.headers.authorization.startsWith('Bearer')
    if(token)
    {
        const AvailableToken = req.headers.authorization.split(" ")[1]
        const user = User.findById(AvailableToken?.id)
        req.user = user
        next()
    }
})

export const isAdminVerify = expressAsyncHandler(async(req,res)=>{
    try {
        const admin = req.user;
        if(!admin) throw new Error('Admin User Not Found')
        if(admin?.role !== 'admin') throw new Error('You Are Not an admin')
        next();
    } catch (error) {
        throw new Error(error)
    }
})


export const token = asyncHandler(async(req,res)=>{
    const token = req.headers.authorization.startsWith('Bearer')
    if(token)
    {
        const userToken = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(userToken,process.env.JWT_SECRET)
        const user = await User.findById(decode?.id)
        req.user = user
    }

})