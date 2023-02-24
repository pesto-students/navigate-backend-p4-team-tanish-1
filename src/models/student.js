const mongoose = require("mongoose");

// student schema
const studentSchema = new mongoose.Schema({
    firebaseID: {
        unique: true,
        required: true,
        type: String
    },
    email: {
        unique: true,
        required: true,
        type: String
    },
    image: {
        required: false,
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
    }
},{
    timestamps: true // add timestamp for createdAt and updatedAt automatically
})

module.exports = mongoose.model('Student', studentSchema)
