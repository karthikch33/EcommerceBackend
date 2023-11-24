import RazorPay from 'razorpay'

const instance = new RazorPay({
    key_id:"rzp_test_ugc9pXTgWudCep",
    key_secret:process.env.RAZORYPAY_KEYSECRET
})

export const checkout = async(req,res)=>{
    const {amount}= req.body
    console.log(req.body);
    const option = {
        amount:amount,
        currency:"INR"
    }
    const order = await instance.orders.create(option)
    res.json({
        success:true,
        order
    })
}

export const paymentVerification = async (req,res)=>{
    console.log(req.body);
    const {razorpayOrderId,razorpayPaymentId} = req.body;
    res.json({
        razorpayOrderId,
        razorpayPaymentId
    })
}

