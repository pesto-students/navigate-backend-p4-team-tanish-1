const Razorpay = require("razorpay")
const crypto = require("crypto")

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
})

async function createOrder(amount){
    //Creating order
    console.log(amount);
    try{
        const order = await instance.orders.create({
            amount: 50000,
            currency: "INR"
        })
        console.log(order);
        return order;
    }
    catch(exception){
        return exception;
    }
}

async function verifyPayment(req, res) {
    const {order_id, payment_id, razorpay_signature} = req.body;
    try{
        const body = order_id + "|" + payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest("hex");
        
        const isVerified = razorpay_signature === expectedSignature;
        res.status(200).json({
            isVerified,
            message: "Signature verified"
        })
    } 
    catch(exception) {
        let message = "Something went wrong"
        res.status(500).json({
            data: null,
            message: message
        });
    }
}

module.exports = { createOrder, verifyPayment }