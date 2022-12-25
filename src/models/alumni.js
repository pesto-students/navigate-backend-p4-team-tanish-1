const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema({
    email: {
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

const SuccessResponse = {}

module.exports = mongoose.model('Alumni', alumniSchema)
