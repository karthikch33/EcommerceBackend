import mongoose from "mongoose";
import bcrypt from 'bcrypt'
const ProductModel = mongoose.Schema({
    Brand:{
        type:String,
        default:"Aditya"
    },
    Model:{
        type:String,
        default:"Karthik",
        unique:true
    },
    OS:{
        type:String,
        default:"Linux"
    },
    Display:{
        type:String,
        default:"LED"
    },
    Processor:{
        type:String,
        default:'Snapdragon'
    },
    Camera:{
        type:String,
        default:"20MP"
    },
    Price:{
        type:String,
        default:"10000"
    },
    PatternSecurity:{
        type:String,
        default:"Windows Firewall"
    },
    MacAddress:{
        type:String,
        default:""
    }
})

ProductModel.pre('save',async function(){
    const saltRounds = await bcrypt.genSaltSync(10)
    this.MacAddress = await bcrypt.hash(this.MacAddress,saltRounds)
    this.PatternSecurity = await bcrypt.hash(this.PatternSecurity,saltRounds)
})




const exModel = mongoose.model('Product',ProductModel)

export default exModel;