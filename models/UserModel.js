import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import crypto from 'crypto'
const userSchema =new  mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobile:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"user"
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    cart:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"ProductA",
        },
        orderedQuantity:{
            type:Number
        },
        color:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'color'
        }
    }],
    address:{
        type:String
    },
    wishlist:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ProductA"
    }],
    compareItems:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'ProductA'
        }
    ],
    orders :[{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'ProductA'
    }],
    refreshToken:{
        type:String,
        default:""
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date
},{timestamps:true})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) { next() }

    const salt = await bcrypt.genSaltSync(10)   
    this.password = await bcrypt.hash(this.password,salt)
    next()
} )

userSchema.methods.createPasswordResetToken = async function(){
    const resetToken = crypto.randomBytes(32).toString("hex")
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000  // 30 minutes
    return resetToken
}


userSchema.methods.isPasswordMatched = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

const User = mongoose.model('User',userSchema);

export default User