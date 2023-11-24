import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
   userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
   },
   productId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"ProductA"
   },
   quantity:{
    type:Number,
    required:true
   },
   price:{
    type:String,
    required:true
   },
   color:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'color'
   }
},{timestamps:true})


const cart = mongoose.model('Cart',cartSchema)

export default cart