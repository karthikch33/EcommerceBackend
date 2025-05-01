import mongoose from "mongoose";

var orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    shippingInfo:{
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        },
        street:{
            type:String,
            required:true
        },
        other:{
            type:String
        },
        pincode:{
            type:Number,
            required:true
        }
    },
    paymentInfo:{
        razorpayOrderId:{
            type:String,
            required:true
        },
        razorpayPaymentId:{
            type:String,
            required:true
        }
    },
    orderItems:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"ProductA",
                required:true
            },
            color:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"color",
                // required:true
            },
            quantity:{
                type:Number,
                required:true
            },
            price:{
                type:Number,
                required:true
            }
        }
    ],
    paidAt:{
        type:Date,
        default:Date.now()
    },
    totalPriceAfterDiscount:{
        type:Number,
        // required:true
    },
    totalPrice:{
        type:Number,
        // required:true
    },
    orderStatus:{
        type:String,
        default:"Ordered"
    }
},{timestamps:true});

const Order = mongoose.model("Order",orderSchema)
export default Order