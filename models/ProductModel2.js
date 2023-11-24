import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    slug:{
    type:String,
    required:true,
    unique:true,
    lowercase:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    brand:{
        type:String,
        required:true,
        // enum:['Apple','Samsung','Lenovo','Redmi','Hp','Vivo','Infinix','Poco']
    },
    category:{
        type:String,
        required:true,
        ref:"Category"
    },
    quantity:{
        type:Number,
        required:true,
    },
    sold:{
        type:Number,
        required:true,
        default:0
    },
    images:[{
        public_id:String,
        url:String
    }],
    color:[
        {
           type:mongoose.Schema.Types.ObjectId,
           ref:"color"
        }
    ],
    tags:String,
    ratings:{
        star:Number,
        comment:String,
        postedby:{type:mongoose.Schema.Types.ObjectId, ref:"User"}
    },
    totalrating:{
        type:String,
        default:0
    }
},{timestamps:true})

const exModel = mongoose.model('ProductA',userSchema);

export default exModel;