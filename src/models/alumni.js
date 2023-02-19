const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema({
    firebaseID: {
        unique: true,
        required: true,
        type: String
    },
    image: {
        required: false,
        type: String
    },
    email: {
        unique: true,
        required: true,
        type: String
    },
    name: {
        required: true,
        type: String
    },
    headline: {
        required: false,
        type: String
    },
    bio: {
        required: false,
        type: String
    },
    organization: {
        required: false,
        type: String
    },
    role: {
        required: false,
        type: String
    },
    workSummary: {
        required: false,
        type: String
    },
    interest: {
        required: false,
        type: Array
    },
    institution: {
        required: false,
        type: String
    },
    course: {
        required: false,
        type: String
    },
    weekdaysFrom: {
        required: false,
        type: String
    },
    weekdaysTo: {
        required: false,
        type: String
    },
    weekendsFrom: {
        required: false,
        type: String
    },
    weekendsTo: {
        required: false,
        type: String
    },
    pricing: {
        required: false,
        type: Number
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Alumni', alumniSchema)
