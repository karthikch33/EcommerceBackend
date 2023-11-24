import mongoose from "mongoose";

const procategorySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index:true
    }
},{timestamps:true})

const category = mongoose.model('procategory',procategorySchema)

export default category;