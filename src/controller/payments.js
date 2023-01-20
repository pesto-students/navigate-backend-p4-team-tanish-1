const Razorpay = require("razorpay")
const crypto = require("crypto");
const session = require("../models/session");

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
})

async function createOrder(amount){
    //Creating order
    console.log(amount);
    try{
        const order = await instance.orders.create({
            amount: amount*100,
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
    const {order_id, payment_id, razorpay_signature, sessionID} = req.body;
    try{
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
        hmac.update(order_id + "|" + payment_id);
        let expectedSignature = hmac.digest('hex');
        const isVerified = razorpay_signature === expectedSignature;
        if(isVerified){
            await session.findOneAndUpdate({_id: sessionID}, {paymentID: payment_id, paymentSignature: razorpay_signature, paid: true});
        }
        res.status(200).json({
            isVerified,
            message: "Signature verified"
        })
    } 
    catch(exception) {
        let message = "Something went wrong"
        res.status(500).json({
            error: exception,
            message: message
        });
    }
}

module.exports = { createOrder, verifyPayment }