import asyncHandler from 'express-async-handler'
import User from '../models/UserModel'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import cookieParser from 'cookie-parser'
import { sendEmail } from '../controllers/emailCtrl'

export const createUser = asyncHandler(async(req,res)=>{

    const {email} = req.body
    const findUser = await User.findOne({email})
    if(findUser) throw new Error('User Email is Already Taken')
    const UserCreation = User.create(req.body)
    res.json(UserCreation)
})

export const createUserHandler = asyncHandler(async(req,res)=>{

    const {email} = req.body;

    const findUser =await  User.findOne({email})

    if(findUser) throw new Error('User Already Exists')

    const User = User.create(req.body)
    res.json(User)

})

export const getallUser = asyncHandler(async(req,res)=>{
    const allUsers =await User.find()
    if(!allUsers) throw new Error('Users Not Found')

    req.json(allUsers)

})

export const getallUserHandler = asyncHandler(async(req,res)=>{
        const users = await User.find()

        if(users) throw new Error('No Users Found')

        res.json(users)
})

export const createUserSequence = asyncHandler(async(req,res)=>{
    const {username,email} = req.body

    if(username) throw new Error('UserName Already Exists')
    if(email) throw new Error('Email already Exists')

    const UserInstance = User.create(req.body)

    res.json(UserInstance)

})

export const loginUser = asyncHandler(async (req,res)=>{
    const {username,password} = req.query;

    if(!username) throw new Error('Username Not Valid')

    
    const userexistance = User.findOne(username)
    if(!userexistance) throw new Error('User Not Found')
    const refreshToken = await Token(userexistance?.id)
    
    const updateUser = User.findByIdAndUpdate(userexistance?.id,{
        refreshToken:refreshToken
    },{new:true})

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        maxAge: 72 * 60 * 60 * 1000
    })

    res.json({
        _id:userexistance?._id,
        username:userexistance?.username,
        phoneNumber:userexistance?.phoneNumber,
        email:userexistance?.email,
        status:userexistance?.status,
        refreshToken:userexistance?.refreshToken
    })

})

export const Token = await function(userid){
    const generatedToken = jwt.sign({id:userid},process.env.JWT_SECRET,{expiresIn:'24hrs'})
    return generatedToken
}


export const loginUserHandler = asyncHandler(async(req,res)=>{
    const {email,password} = req.body

    if(!email) throw new Error('email is not Valid')
    if(!password) throw new Error('password is missing')
    const UserDb = User.findOne({email})
    if(!UserDb) throw new Error('User Not found in DB')
    if(password){
        const dbPassword =UserDb?.password;
        const checkPassword =await bcrypt.compare(password,dbPassword);
        if(!checkPassword) throw new Error('Password MisMatch')

        const refreshToken = TokenParser(UserDb?._id)
        
        const updateUser = await User.findByIdAndUpdate(UserDb?.id,{
            refreshToken:refreshToken
        },{new:true})

        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            maxAge: 72 * 60 * 60 * 1000
        })

        res.json({
            _id:userexistance?._id,
            username:userexistance?.username,
            phoneNumber:userexistance?.phoneNumber,
            email:userexistance?.email,
            status:userexistance?.status,
            refreshToken:userexistance?.refreshToken
        })

    }
    
 
})



export const logoutUserHandler = asyncHandler(async(req,res)=>{
    const cookies = req.cookies;
    if(!cookies?.refreshToken) throw new Error('refreshToken Not found in the Cookies')

    const refreshToken = cookies?.refreshToken
    const UserOnRefreshToken = await User.findOne({refreshToken})

    if(!UserOnRefreshToken){
    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:true
    })
    res.sendStatus(204) //forbidden
    }

    await User.findOneAndUpdate({refreshToken},{
        refreshToken:''
    },{new:true})

    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:true
    })

    return res.json('Logged Out')

})


export const logoutUser = asyncHandler(async(req,res)=>{

    const cookies = req.cookies;

    const refreshedToken = cookies?.refreshToken

    if(!refreshedToken){
        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:true
        })
        res.sendStatus(204)
    }

    const userDb = await User.findOneAndUpdate({refreshedToken},{
        refreshedToken:''
    })

    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:true
    })

    res.json('LoggedOut SuccessFull')
})



const TokenParser =async (userid)=>{
    return jwt.sign({id:userid},process.env.JWT_SECRET,{expiresIn:'24hrs'})
}

const BlockUser = asyncHandler(async(req,res)=>{
    try {
        const {id} = req.query;

    if(!id) throw new Error('User Not Found')

    const user =await User.findByIdAndUpdate(id,{
        isBlocked:true
    },{new:true})
    } catch (error) {
        throw new Error(error)
    }
})

const UnBlockUser = asyncHandler(async(req,res)=>{
    try {
        const {id} = req.query
        if(!id) throw new Error('User Not Found')
        const user = await User.findByIdAndUpdate(id,{
            isBlocked:false
    },{new:true})

    } catch (error) {
        throw new Error(error)
    }
})

const getUser = asyncHandler(async(req,res)=>{
    const {id} = req.query

    if(!id) throw new Error('User Not Found')

    try {   
        const getuser = await User.findById(id)

        if(!getuser) throw new Error('User Not found')

        res.json(getuser)


    } catch (error) {
        throw new Error(error)
    }



})


const deleteUser = asyncHandler(async(req,res)=>{
    try {
        const {id} = req.query;
        const getUser = await User.findByIdAndDelete(id)
        if(!getUser) throw new Error('User Not found')
        res.json(getUser)
    } catch (error) {
        throw new Error(error)
    }
})

const updateUser = asyncHandler(async(req,res)=>{
    try {
        const {id} = req.body;

        if(!id) throw new Error('Id not found')
        const getUser = User.findByIdAndUpdate(id,req.body,{new:true})

        if(!getUser) throw new Error("User Not Found")

        res.json(getUser)


    } catch (error) {
        throw new Error(error)
    }
})

export const forgotPasswordToken = asyncHandler(async(req,res)=>{

    const {email} = req.body
    
    try {
        const user =await User.findOne({email})
        
        if(!user) throw new Error('User Not Found')
        
        const token = await user.createPasswordResetToken();
        await user.save()

        const resetUrlPage = `Hey User Follow This Url To Reset Your Password  urllink..../${token}`

        const data = {
            to: email,
            text:"HI This is Something I Wrote To You",
            htm:resetUrlPage
        }

        sendEmail(data)
        res.json(token)

        
    } catch (error) {
        throw new Error(error)
    }
    
})


export const forgotPasswordTokenHandler = asyncHandler(async(req,res)=>{
    const {email} = req.body
    const user =await  User.findOne({email})
    if(!user) throw new Error('user not found')
    const token = user.createPasswordResetToken()
    await token;

    const data={
        to:email,
        text:"Hi this is text generated",
        htm:'index.html'
    }

    sendEmail(data)
    res.json(token)


})


export const resetPassword = asyncHandler(async(req,res)=>{
    const {token} = req.params
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    if(!hashedToken) throw new Error('no Token')

    const user = await User.findOne({
        PasswordResetToken:hashedToken,
        PasswordResetExpiry: {$gt:Date.now()}
    })


    if(!user) throw new Error('Token Expired do again')

    user.password = password;
    user.passwordResetToken = undefined,
    user.PasswordResetExpiry = undefined,
    await user.save()
    res.json(user)
})



const secret = crypto.randomBytes(32).toString('hex')
const token = crypto.createHash('sha365').update(secret).digest('hex')
