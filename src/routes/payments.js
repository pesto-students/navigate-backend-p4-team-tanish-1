const paymentController = require("../controller/payments")
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Payment router");
})

router.post('/create/', paymentController.createOrder);
router.post('/verify/', paymentController.verifyPayment);

module.exports = router