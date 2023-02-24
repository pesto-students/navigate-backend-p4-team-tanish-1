// Import schema and create router
const paymentController = require("../controller/payments")
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Payment router");
})

// create order API
router.post('/create/', paymentController.createOrder);

// verify payment signature razorpay
router.post('/verify/', paymentController.verifyPayment);

module.exports = router