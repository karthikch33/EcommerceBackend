import mongoose from "mongoose";

const brandModelSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index:true
    }
},{timestamps:true})

const brand = mongoose.model('brand',brandModelSchema)

export default brand;