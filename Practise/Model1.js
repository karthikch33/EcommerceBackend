import mongoose from 'mongoose'


const ListSchema = new mongoose.Schema({
    fname:{
        type:String,
        lowercase:false,
        default:"",
        unique:false
    },
    slugify:{
        type:String,
        default:""
    },
    lname:{
        type:String,
        lowercase:false,
        default:"",
        unique:false
    },
    Address:[{
        country:{
            type:String,
            enum:["India","Bangladesh","SriLanka","US"],
            default:"India"
        },
        state:{
            type:String,
            default:"",
        },
        city:{
            type:String,
            default:"",
        },
        street1:{
            type:String
        },
        street2:{
            type:String,
        },
        doorno:{
            type:Number,
            default:"96-85-7"
        },
        pincode:{
            type:Number
        }
    }],
})


const ModelSchema = mongoose.model('Mode1',ListSchema)

export default ModelSchema