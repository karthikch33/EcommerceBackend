import mongoose from "mongoose";
// Declare the Schema of the Mongo model
var enquirySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    mobile:{
        type:String,
        required:true,
    },
    comment:{
        type:String,
    },
    status:{
        type:String,
        default:"Submitted",
        enum:["Submitted",'Contacted','In Progress']
    }
},{timestamps:true});

const enquiry = mongoose.model('enquiry',enquirySchema)

export default enquiry