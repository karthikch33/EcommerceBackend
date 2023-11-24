import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:String,
    firstname:Number,
    lastname:Number,
    slug:{
        type:String,
        lowercase:true
    },
    awards:{
        type:Array,
        enum:["NandiAward","OscarAward","Padmabushan","Padmavibushan","FilmyAwards"]
    },
    Address:[{
        country:String,
        state:String,
        district:String,
        town:String,
        pincode:{
            type:Number,
            required:true,
            unique:true,
            default:522306
        },
        street:[{
            type:String,
            default:"",
            required:true
        }],
        doorNo:Number
    }],


},{timestamps:true})

const product = mongoose.model('product',productSchema)

export default product