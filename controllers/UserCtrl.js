import generateToken from "../config/jwtToken.js";
import User from "../models/UserModel.js";
import Employee from "../models/EmployeeModel.js";
import exModel from '../models/ProductModel2.js'
import Order from "../models/orderModel.js";
import Coupon from '../models/couponModel.js'
import Cart from '../models/cartModel.js'
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken'
import uniqid from 'uniqid'
import validateMongoDbId from '../utils/validateMongodbId.js'
import generateRefreshToken from "../config/refreshToken.js";
import crypto from 'crypto'
import { sendEmail } from "./emailCtrl.js";
// import validateMongoDbId from "../utils/validateMongodbId.js";



export const createUser = asyncHandler( async (req,res)=>{
    const {email} = req.body
    const findUser = await User.findOne({email})
    if(!findUser){
        // const newUser = new User(destructure)   one way new way is below
        
        const newUser = User.create(req.body)
        res.json({status:201})
    }   
    else{
       res.json({status:404})
    }
})


export const loginUserCtrl = asyncHandler(async (req,res)=>{
    const {email,password} = req.body;
    // check if user exist or not 
    const findUser = await User.findOne({email});

    if(!findUser) res.json({status:405})
    
    if(findUser && await findUser.isPasswordMatched(password)){
        const refreshToken = await generateRefreshToken(findUser?._id)
        const updateuser = await User.findByIdAndUpdate(findUser?.id,{
            refreshToken:refreshToken
        },{new:true})

        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            maxAge:72*1
        })
        
        res.json({
            _id:findUser?._id,
            firstname:findUser?.firstname,
            lastname:findUser?.lastname,
            email:findUser?.email,
            mobile:findUser?.mobile,
            wishlist:findUser?.wishlist,
            compareItems:findUser?.compareItems,
            refreshToken:generateToken(findUser?._id)
        })
    }else{
        res.json({status:404,message:"Invalid Credentials"})
    }
})


// admin login

export const loginAdmin = asyncHandler(async (req,res)=>{
    const {email,password} = req.body;
    // check if user exist or not 
    const findAdmin = await User.findOne({email});
    if(!findAdmin) res.json('Admin Data Not Recorded')
    if(findAdmin.role !== 'admin') throw new Error('Not Authorized')
    
    if(findAdmin && await findAdmin.isPasswordMatched(password)){
        const refreshToken = await generateRefreshToken(findAdmin?._id)
        const updateuser = await User.findByIdAndUpdate(findAdmin?.id,{
            refreshToken:refreshToken
        },{new:true})

        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            maxAge:72*60*60*1000
        })
        
        res.json({
            _id:findAdmin?._id,
            firstname:findAdmin?.firstname,
            lastname:findAdmin?.lastname,
            email:findAdmin?.email,
            mobile:findAdmin?.mobile,
            refreshToken:generateToken(findAdmin?._id)
        })
    }else{
        throw new Error(`Invalid Credentialss`)
    }
})


// handlerequest token

export const handleRequestToken = asyncHandler(async (req,res)=>{
    const cookie = req.cookies
    if(!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies')
    const refreshToken = cookie.refreshToken
    const user = await User.findOne({refreshToken});
    if(!user) throw new Error(`No Refresh Token present in db or not matched`)
    jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded)=>{
        if(err || user.id !== decoded.id) throw new Error('There is something wrong with refresh token')
    })
    const accessToken = generateToken(user?.id)
    res.json({"AccessToken":accessToken})
})

// logout function

export const logoutHandler = asyncHandler(async (req,res)=>{
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error('No Refresh Token in Cookie')
    const refreshToken = cookie?.refreshToken
    const user =await User.findOne({refreshToken})
    if(!user) {
        res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:true
    })
    return res.status(204)  // forbidden access 
    }
    await User.findOneAndUpdate({refreshToken},{
        refreshToken:"",
    })
    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:true
    })
    return res.json('logged Out') // forbidden
})



// get all users

export const getallUser = asyncHandler(async (req,res)=>{

    try {
        const getUsers = await User.find()
        res.json(getUsers)
        
    } catch (error) {
     throw new Error(error)   
    }

})


// get a single user

export const getaUser = asyncHandler(async(req,res)=>{
    try {
        const {id} = req.user;
        // validateMongoDbId(Id)

        const getuser =await User.findById(id)
        res.json(getuser)
    } catch (error) {
        throw new Error(error)
    }
})


// delete a user 

export const deleteUser = asyncHandler(async (req,res)=>{
    try {
        const {id} = req.params
        // validateMongoDbId(id)
        const deleteuser = await User.findByIdAndDelete(id)

            res.json({
                deleteuser
            })

    } catch (error) {
        throw new Error(error)
    }
})


// update a user 

export const updateUser = asyncHandler(async(req,res)=>{
    try {
        const {_id} = req.user
        // validateMongoDbId(_id)
        const updateuser = await User.findByIdAndUpdate(_id,{
            firstname:req?.body.firstname,
            lastname:req?.body.lastname,
            mobile:req?.body.mobile,
        },{new:true})

        res.json({status:201})

    } catch (error) {
        res.json({status:500,error})
    }
})


export const blockuser = asyncHandler(async(req,res)=>{
    const {id} = req.user
    // validateMongoDbId(id)
    try {
        const block = await User.findByIdAndUpdate(id,{
            isBlocked:true
        },{new:true})
        res.json(block)
    } catch (error) {
        throw new Error(error)
    }
})

export const unblockuser = asyncHandler(async(req,res)=>{
    const {id} = req.user
    // validateMongoDbId(id)
    try {
        const unblockuser = await User.findByIdAndUpdate(id,{
            isBlocked:false,
        },{
            new:true
        })
        res.json(unblockuser)
    } catch (error) {
        throw new Error(error)
    }
})

export const updatePassword = asyncHandler(async(req,res)=>{
    const {_id} = req.user;
    const {password} = req.body;
    validateMongoDbId(_id)
    const user = await User.findById(_id)
    if(password){
        user.password = password  // doing directly without any UpdateOne
        const updatedPassword = await user.save() // after saving
        res.json(updatedPassword)
    }
    else{
        res.json(user)
    }
})


export const forgotPasswordToken = asyncHandler(async (req,res)=>{
    const {email} = req.body
    const user = await User.findOne({email})

    if(!user) throw new Error('User Not Found with this email')
    const firstname = user?.firstname;
    try {
        const token = await user.createPasswordResetToken();
        await user.save()
        const resetURL = `Hi ${firstname}, Please Follow This link to reset Your Passwrod. This link is valid till 30 minutes from now  <a href="https://ecc-frontend-olive-zeta.vercel.app/reset-password/${token}">Click Here</a>`
        const data ={
            to:email,
            text:"Hey User",
            subject:"Forgot Password Link",
            firstname,
            htm:resetURL
        }
        sendEmail(data)
        res.json(token)
    } catch (error) {
        throw new Error(error)
    }

})


export const resetPassword = asyncHandler(async (req,res)=>{
    const {password} = req.body
    const {token} = req.params
    const hashedToken = crypto.createHash('sha256').update(token).digest("hex")
    const user = await User.findOne({
        passwordResetToken:hashedToken.toString(),
        passwordResetExpires:{$gt:Date.now()}
    })
    if(!user) throw new Error('Token Expired, Please try again later')
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save()
    res.json(user)
})  


export const getWishlist = asyncHandler(async(req,res)=>{
    const {id} = req.params
    try {
        const findUser = await User.findById(id).populate('wishlist')
        res.json(findUser?.wishlist)
    } catch (error) {
        throw new Error(error)
    }
})

// save address

export const saveAddress = asyncHandler(async(req,res)=>{
    const {id} = req.params
    try {
        const updateAddress = await User.findByIdAndUpdate(id,{
            address:req?.body?.address      
        })
        res.json(updateAddress)
    } catch (error) {
        throw new Error(error)
    }
})

export const userCart = asyncHandler(async (req, res) => {
    const { color, productId, orderedQuantity } = req.body;
    const { id } = req.user;
  
    try {
      const userCart = await User.findById(id);
      const alreadyAddedItem = userCart.cart.some((item) => item?.productId.equals(productId));
  
      if (alreadyAddedItem) {
        const updatedUser = await User.findOneAndUpdate(
          {
            _id: id,
            'cart.productId': productId,
          },
          {
            $set: {
              'cart.$.orderedQuantity': Math.max(userCart.cart.find(item => item.productId.equals(productId)).orderedQuantity + orderedQuantity, 1),
            }, 
          },
          { new: true }
        );
  
        if (updatedUser) {
          if (orderedQuantity > 0) {
            res.status(200).json({ message: 'Product Incremented to cart successfully', updatedUser });
          } else {
            res.status(200).json({ message: 'Product Decremented to cart successfully', updatedUser });
          }
        }
      } else {
        const newProductAdditionToCart = await User.findByIdAndUpdate(
          id,
          {
            $push: {
              cart: {
                productId,
                orderedQuantity: Math.max(orderedQuantity, 1), 
                color,
              },
            },
          },
          { new: true }
        );
        res.status(200).json({ message: 'Product added to cart successfully', newProductAdditionToCart });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  
  

export const getUserCart = asyncHandler(async(req,res)=>{
    const {id} = req.params
    try{
        const cart = User.findById(id)
        const productCart = await cart.populate('cart.productId cart.color')
        res.json(productCart.cart)
    }catch(error)
    {
        throw new Error(error)
    }
})

export const emptyCart = asyncHandler(async(req,res)=>{
    const {_id} = req.params
    const {id} = req.user
    try {
        const cart = await User.findOneAndUpdate({_id:id,"cart.productId":_id},{
            $pull:{
                cart:{
                    productId:_id,
                }
            }
        },{new:true})
        res.json(cart)
    } catch (error) {
        throw new Error(error)
    }
})


export const emptyEntireCart = asyncHandler(async(req,res)=>{
    const {id} = req?.user
    // res.json(id)
    console.log(id);
    try {
        const emptyCart = await User.findOneAndUpdate(
            { _id: id },
            { $set: { cart: [] } },
            { new: true }
        );

        res.json(emptyCart);
    } catch (error) {
        res.status(500).json({ error: 'Could not empty cart' });
    }
})


export const applyCoupon = asyncHandler(async(req,res)=>{
    const {coupon} = req.body;
    const {_id} = req.user
    const validCoupon = await Coupon.findOne({name:coupon})
    if(validCoupon === null) throw new Error("Invalid Coupon")
    let {products,cartTotal} = await Cart.findOne({orderby:_id})
    let totalAfterDiscount = (cartTotal - (cartTotal-validCoupon.discount)/100).toFixed()
    await Cart.findOneAndUpdate({orderby:_id},{
        totalAfterDiscount
    },{new:true})
    res.json(totalAfterDiscount)
})

// export const createOrder = asyncHandler(async(req,res)=>{
//     const {COD,couponApplied} = req.body
//     const {_id} = req.params
//     try {
//         if(!COD) throw new Error('Create cash order Failed')
//         const user = await User.findById(_id)
//         let userCart = await Cart.findOne({orderby:user._id})
//         let finalAmount = 0
//         if(couponApplied && userCart.totalAfterDiscount)
//         {
//             finalAmount = userCart.totalAfterDiscount 
//         }
//         else
//         {
//             finalAmount = userCart.cartTotal 
//         }
//         let newOrder =  new Order({
//             products:userCart.products,
//             paymentIntent:{
//                 id:uniqid(),
//                 method:"COD",
//                 amount: finalAmount,
//                 status:"Cash On Delivery",
//                 created:Date.now(),
//                 currency:"INR"
//             },
//             orderby:user._id,
//             orderStatus:"Cash on Delivery"
//         })
//         await newOrder.save()
//         let update = userCart.products.map((item)=>{
//             return{
//                 updateOne:{
//                     filter:{_id:item.product._id},
//                     update:{$inc:{quantity:item.count,sold: +item.count}}
//                 }
//             }})
//             const updated = await exModel.bulkWrite(update,{})
//             res.json({message:"success"})
//     } catch (error) {
//         throw new Error(error)
//     }
// })

export const createOrder = asyncHandler(async (req,res)=>{
    console.log(req.body);
    const {shippingInfo,orderItems,totalPrice,totalPriceAfterDiscount,paymentInfo} = req.body
    const {_id} = req?.user
    try {
        const order = await Order.create({
            shippingInfo,orderItems,totalPrice,totalPriceAfterDiscount,paymentInfo,user:_id
        })
        res.json({order,success:true})
    } catch (error) {
        throw new Error(error)
    }
})

export const getOrders = asyncHandler(async(req,res)=>{
    const {_id} = req?.user
    try {
        const userorders = await Order.findOne({orderby:_id}).populate("products.product").populate("orderby").exec()
        res.json(userorders)
    } catch (error) {
        throw new Error(error)
    }
})

export const getAllOrders = asyncHandler(async(req,res)=>{
    try {
        const userorders = await Order.find().populate("orderby").populate("products.product")
        res.json(userorders)
    } catch (error) {
        throw new Error(error)
    }
})

export const updateOrderStatus = asyncHandler(async(req,res)=>{
    const {_id} = req.params
    const {status} = req.body
    try {
        const updateOrder = await Order.findByIdAndUpdate(_id,{
            orderStatus : status,
            paymentIntent: {
                status:status
            }
        },{new:true})
        res.json(updateOrder)
    } catch (error) {
        throw new Error(error)
    }
})

// Add Compare

export const addToCompare = asyncHandler(async(req,res)=>{
    const {productId} = req.params
    const actualId = productId.split(' ')[1] === "remover" ? productId.split(' ')[0] : productId;
    const remover = productId.split(' ')[1] === "remover" ? "remover" : "notremover";
    const {_id} = req.user
    try {
        const findItem = await User.findById(_id).populate('compareItems')
        const alreadyAdded = findItem?.compareItems?.find(item=>item?._id.toString() === actualId.toString())
        if(alreadyAdded)
        {
            const updateCompareItems = await User.findById(_id)
            if(remover ==='remover')
            {
                const cheating = await User.findByIdAndUpdate(_id,{$pull:{compareItems:actualId}},{new:true})
            }
            res.json({...updateCompareItems,alreadyExist:true})
        }
        else{
            const updateCompareItems = await User.findByIdAndUpdate(_id,{$push:{compareItems:actualId}},{new:true})
            res.json({...updateCompareItems,alreadyExist:false})
        }
    } catch (error) {
        throw new Error(error)
    }
})


// Get CompareItems

export const getCompareItems = asyncHandler(async(req,res)=>{
    const {id} = req.params
    try {
        const Items = await User.findById(id).populate('compareItems')
        res.json({
            compareItems:Items?.compareItems
        })
    } catch (error) {
        throw new Error(error)
    }
})

export const getMyOrders = asyncHandler(async(req,res)=>{
    const {id} = req?.body
    try {
        const orders = User.find({_id:id})
    } catch (error) {
        throw new Error(error)
    }
})