import jwt from 'jsonwebtoken'
import Employee from '../models/EmployeeModel.js'
const jwtToken = (id)=>{
    const token = jwt.sign({id:id},process.env.JWT_SECRET,{expiresIn:'24hr'})
    return token
}


export const isAdmin2 = async (req,res,next)=>{
    const {id} = req.emp

    try {
        const EmployeeExist =await Employee.findById(id)
        const isAuth = EmployeeExist.isAdmin
        if(EmployeeExist && isAuth){
            next()
        }else{
           res.json("You are not an Admin")
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const tokenVerify = async(req,res,next)=>{
    try {
        const token = req.headers.authorization.startsWith('Bearer')
        if(token){
            const tokenavl = req.headers.authorization.split(' ')[1]
            const decode = jwt.verify(tokenavl,process.env.JWT_SECRET)
            const emp = await Employee.findById(decode?.id)
            req.emp = emp
            next()
        }
    } catch (error) {
        throw new Error(error)
    }
}