import expressAsyncHandler from "express-async-handler"
import User from "../models/UserModel"
import generateToken from "../config/jwtToken"
export const createUser =expressAsyncHandler(async (req,res)=>{
    const {email} = req.body

    try {
      const emailUser = await  User.findOne({email})

      if(emailUser){
        throw new Error(`User Already Exists`)
      }

      const user = User.create(req.body)
      res.json(user)

    } catch (error) {
        throw new Error(error)
    }

})

// user delete based on id

export const deleteUser =async (req,res)=>{
    const {id} = req.params;
    try {
       const deleteuser = await User.findByIdAndDelete(id)
       if(deleteUser){
           res.status(201).json(deleteUser)
       }
    } catch (error) {
        throw new Error(`The error is Caused by ${error}`)
    }
}

// get all users

const findallusers = expressAsyncHandler(async (req,res)=>{
    try {
        const findall = await User.find()
        if(findall){
            res.json(findall)
        }
    } catch (error) {
        throw new Error(error)
    }
})

// get a single user

export const singleuser = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params
    try {
        const user =await  User.findById(id)
        if(user){
            res.json(user)
        }
    } catch (error) {
        throw new Error(error)
    }
})

// update a user

const updateUser = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params

    try {
        const getUser = User.findByIdAndUpdate(id,req.body,{new:true})

    if(getUser){
        res.json(getUser)
    }
    } catch (error) {
        throw new Error(error)
    }
})

// login controller

const login = expressAsyncHandler(async (req,res)=>{
    const {email,password} = req.body;

    try {
        const findUser = User.findOne({email})

        if(findUser && User.isPasswordMatch(password)){
            const token = generateToken(findUser?._id)
            const updatedreq = Object.assign({},...req.body,token)
            delete updatedreq.password
            res.json(updatedreq)
        }
    } catch (error) {
        throw new Error(error)
    }
})
