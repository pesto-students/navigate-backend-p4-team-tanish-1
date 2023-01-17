const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    studentID: {
        required: true,
        type: String
    },
    alumniID: {
        required: true,
        type: String
    },
    topic: {
        required: true,
        type: String
    },
    agenda: {
        required: true,
        type: String
    },
    date: {
        required: true,
        type: String
    },
    from: {
        required: true,
        type: String
    },
    to: {
        required: true,
        type: String
    },
    amount: {
        required: true,
        type: Number
    },
    paid: {
        required: false,
        type: Boolean
    },
    paymentID: {
        required: false,
        type: String
    },
    meetingLink:{
        required: false,
        type: String
    },
    meetingID: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('Sessions', sessionSchema)
