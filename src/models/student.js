const mongoose = require("mongoose");

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
    workOrg: {
        required: false,
        type: String
    },
    workRole: {
        required: false,
        type: String
    },
    workSummary: {
        required: false,
        type: String
    },
    interests: {
        required: false,
        type: Array
    },
    eduInstitute: {
        required: false,
        type: String
    },
    eduDegree: {
        required: false,
        type: String
    }
})

module.exports = mongoose.model('Student', studentSchema)
