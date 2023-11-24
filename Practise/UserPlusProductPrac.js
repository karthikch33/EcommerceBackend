import asyncHandler from 'express-async-handler'
import User from '../controllers/UserCtrl.js'
import bcyrpt from 'bcrypt'
import jwt from 'jsonwebtoken'
import exModel from '../controllers/ProductCtrl.js'
import cookieParser from 'cookie-parser'



// UserSide

export const userLogin = asyncHandler(async (req,res)=>{
    const {username,password} = req.query;
    try {
        if(!username) throw new Error('UserName Required >>>')
        if(!password) throw new Error('Password Required >>>')

        const dbUser = User.findOne({username})

        if(!dbUser) throw new Error('User Not Found >>>')

        if(password){
            const decryptPassword = bcyrpt.compare(password,dbUser?.password)
            if(!decryptPassword) throw new Error('Password Not Math >>>')

            const refreshToken = generateToken(dbUser?._id)

            const updateUser = await User.findByIdAndUpdate(dbUser?._id,{
                refreshToken:refreshToken
            },{new:true})

            res.cookie("refreshToken",refreshToken,{
                httpOnly:true,
                secure:true,
                maxAge:72 * 60 * 60 * 1000
            })

            res.json(updateUser)

        }

    } catch (error) {
        throw new Error(error)
    }
})


//  ProductSide

export const getRequiredProducts = asyncHandler(async(req,res)=>{
    const queryObject = {...req.query}
    const excludeItems = ['sort','fields','limit','page']

    excludeItems.forEach(ele=>delete queryObject[ele]) // deleting these keys in the query object

    // http://localhost:8080/api/products/getallproducts/?price[gte]=1000&price[lte]=8000

    // Filtering

    const stringChanger = JSON.stringify(queryObject)

    const stringReplacer = stringChanger.replace(/\b(gte|lte|lt|gt)\b /g,match=> `$${match}`)


    let productManipulation = exModel.find(JSON.parse(stringReplacer))


    // Sorting

    if(req.query.sort){
        const sorting = req.query.sort.split(',').join(' ')
        productManipulation = productManipulation.sort(sorting)
    }
    else{
        productManipulation = productManipulation.sort('-createdAt')
    }

    // Limiting The fields

    if(req.query.fields){
        const limiting = req.query.fields.split(',').join(' ')
        productManipulation = productManipulation.select(limiting)
    }
    else{
        productManipulation = productManipulation.select('__v')
    }


    // pagination

    if(req.query.page && req.query.limit){
        const page = req.query.page
        const limit = req.query.limit
        const skip = (page - 1) * limit

        const countDocuments = exModel.countDocuments()

        if(skip > countDocuments) throw new Error('Page Not Found')


        productManipulation = productManipulation.skip(skip).limit(limit)
    }


    const queryOnDb = await productManipulation
    res.json(queryOnDb)

})




const generateToken = (userid)=>{
    return jwt.sign({id:userid},process.env.JWT_SECRET,{expiresIn:'24hrs'})
}