import mongoose from "mongoose";
// Updated GitHub URL
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numViews:{
        type:Number,
        default:0
    },
    isLiked:{
        type:Boolean,
        default:false
    },
    isDisLiked:{
        type:Boolean,
        default:false
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        
        ref:"User"
    }],
    dislikes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    images:[{
        public_id:String,
        url:String
    }],
    author:{
        type:String,
        default:"Admin"
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    timestamps:true
});

const blogs = mongoose.model('blog',blogSchema)

export default blogs