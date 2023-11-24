import expressAsyncHandler from "express-async-handler";
import User from "../models/UserModel";
import bcrypt from 'bcrypt'
User.pre('save',async (next)=>{
    const saltRounds = await bcrypt.genSaltSync(10)
    this.password  = await bcrypt.hash(this.password,saltRounds)
})


User.methods.isAditya =async function(password){
    return await bcrypt.compare(password,this.password)
}

User.pre('save',()=>{
    const saltrounds = bcrypt.genSaltSync(10)
    this.password = bcrypt.hash(this.password,saltrounds)
})

User.methods.mymethod = expressAsyncHandler(async (password)=>{
    return await bcrypt.compare(password,this.password)
})

const UserError = (err,req,res,next)=>{
    const statusCode =  statusCode === 200 ? 500 : req.statusCode;
    res.statusCode(statusCode)
    res.json({
        message:err?.message,
        stack:err?.stack
    })
}


Users.methods.isMethod = function(password){
    return bcrypt.compare(password,this.password)
}

const notfound = (req,res,next)=>{

}