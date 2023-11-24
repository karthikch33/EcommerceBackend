import mongoose from "mongoose";
import coupon from '../models/couponModel.js'
import asyncHandler from 'express-async-handler'
export const couponCreate =asyncHandler(async(req,res)=>{
    const couponCreation = req.body;

})