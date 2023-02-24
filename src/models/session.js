const mongoose = require("mongoose");
const Schema = mongoose.Schema

// session schema
const sessionSchema = new Schema({
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
    meetingID: {
        required: true,
        type: String
    },
    student: { 
        type: Schema.Types.ObjectId, 
        ref: 'Student' 
    },
    alumni: { 
        type: Schema.Types.ObjectId, 
        ref: 'Alumni' 
    },
    orderID: {
        required: false,
        type: String
    },
    paymentID: {
        required: false,
        type: String
    },
    paymentSignature: {
        required: false,
        type: String
    },
    participants: {
        required: false,
        type: Array
    },
    at: {
        required: false,
        type: Number
    }
},{
    timestamps: true // add timestamp for createdAt and updatedAt automatically
})

module.exports = mongoose.model('Sessions', sessionSchema)
