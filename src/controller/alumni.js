const Alumni = require("../models/alumni");

async function Create(req, res) {
    try {
        const alumniObj = new Alumni(req.body);
        const savedObj = await alumniObj.save();
        res.status(200).json({
            data: savedObj,
            message: "Data saved to database",
        });
    } catch(exception) {
        console.log(exception);
        res.status(500).json({
            data: exception,
            message: "Something went wrong",
        });
    }
}

async function Update(req, res) {
    console.log(req.body);
    try {
        let alumni_id = req.params.id;
        const interests = req.body.interests.split(", ")
        console.log(interests);
        const data = await Alumni.findByIdAndUpdate(alumni_id, {
            name: req.body.name,
            headline: req.body.headline,
            bio: req.body.bio,
            workOrg: req.body.workOrg,
            workRole: req.body.workRole,
            workSummary: req.body.workSummary,
            interests: interests,
            eduInstitute: req.body.eduInstitute,
            eduDegree: req.body.eduDegree
        });
        res.status(200).json({
            data: data,
            message: "Record updated successfully",
        });
    } catch (exception) {
        console.log(exception);
        res.status(500).json({
            data: exception,
            message: "Something went wrong",
        });
    }
}

async function Read(req, res) {
    try {
        const data = await Alumni.find();
        res.status(200).json({
            data: data,
            message: "Alumnis fetched successfully",
        });
    } catch (exception) {
        console.log(exception);
        res.status(500).json({
            data: exception,
            message: "Something went wrong",
        });
    }
}

async function ReadByID(req, res) {
    try {
        const alumni_id = req.params.id
        const data = await Alumni.findById(alumni_id);
        res.status(200).json({
            data: data,
            message: "Alumni fetched successfully",
        });
    } catch (exception) {
        console.log(exception);
        res.status(500).json({
            data: exception,
            message: "Something went wrong",
        });
    }
}

module.exports = { Create, Update, Read, ReadByID };
