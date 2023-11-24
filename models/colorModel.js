import mongoose from "mongoose";

const colorModel = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index:true
    }
},{timestamps:true})

const ColorSch = mongoose.model('color',colorModel)

export default ColorSch