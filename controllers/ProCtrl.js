import exModel from "../models/ProductModel.js";

export const ProductRegister =async (req,res)=>{
    const {Model} = req.body;

    try {
        const brandExistance = await exModel.findOne({Model})
        if(!brandExistance){
            const registerModel = exModel.create(req.body)
            res.json(registerModel)
        }else{
            throw new Error({message:"Model is Already Registered "})
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const ProductAvailable =async (req,res)=>{
    const {Model} = req.body;
    try {
        const ProductStatus = await exModel.findOne({Model})
        if(ProductStatus) res.json({message:"Model is Available"})
        else res.json({message:"Model is Unavailable"})
    } catch (error) {
        throw new Error(error)
    }
}