import mongoose, { Mongoose } from "mongoose";
import bcrypt, { hashSync } from 'bcrypt'

const EmployeeSchema = mongoose.Schema({
    firstName:{
        type:String,
        default:"",
        required:true
    },
    middleName:{
        type:String,
        default:""
    },
    lastName:{
        type:String,
        default:"",
        required:true
    },
    empId:{
        type:String,
        default:"",
        required:true
    },
    password:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        default:"",
        required:true
    },
    region:{
        type:String,
        default:"",
        required:true
    },
    subRegion:{
        type:String,
        default:"",
        required:true
    },
    address:{
        type:String,
        default:"",
        required:true
    },
    isBlocked:{
        type:Boolean,
        default:false,
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    pinCode:{
        type:Number,
        default:0,
        required:true
    },

})

EmployeeSchema.pre('save',async function(next){

    //hasing password
    const saltRounds = await bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password,saltRounds)

    next()

})




EmployeeSchema.methods.PasswordMatch = async function(passwor){
    console.log(this.password)
    return await bcrypt.compare(passwor,this.password)
}





const Employee = mongoose.model('EmployeeR',EmployeeSchema)

export default Employee