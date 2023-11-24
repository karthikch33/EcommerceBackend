import generateToken from "../config/jwtToken.js"
import Employee from "../models/EmployeeModel.js"

export const loginEmpl = async (req,res)=>{
    const {empId,password} = req.body
    console.log(empId+password)
    try {
        const existLogin = await Employee.findOne({empId})
        if(existLogin){
        if(existLogin && existLogin.PasswordMatch(password)){
            const token = generateToken(existLogin._id)
            res.json({existLogin,token})
        }
    }else{
            throw new Error('EmpId Not Found')
        }
    } catch (error) {
        throw new Error(error)
    }
    
}

// block emp 

export const blockemp = async(req,res)=>{
    const {id} = req.params
    try {
        const blockemp = await Employee.findByIdAndUpdate(id,{
            isBlocked:true
        },{
            new:true
        })
        res.json(blockemp)
    } catch (error) {
        throw new Error(error)
    }
}


export const unblockEmp = async(req,res)=>{
    const {id} = req.params
    try {
        const unblockUser =await Employee.findByIdAndUpdate(id,{
            isBlocked:false
        },{
            new:true
        })
        res.json(unblockUser)
    } catch (error) {
        throw new Error(error)
    }
}

export const  getEmp =async (req,res)=>{
    const {id} = req.body

    try {
        const getEmployee = await Employee.findOne({id})
        if(getEmployee){
            res.json(getEmployee)
        }else{
            throw new Error('Employee Not Found')
        }
    } catch (error) {
        throw new Error(error)
    }
}