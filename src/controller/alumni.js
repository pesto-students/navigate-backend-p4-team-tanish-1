const Alumni = require("../models/alumni");
const Session = require("../models/session");

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
            error: exception,
            message: "Something went wrong",
        });
    }
}

async function Update(req, res) {
    const availability = {
        weekdaysFrom: req.body.weekdaysFrom,
        weekdaysTo: req.body.weekdaysTo,
        weekendFrom: req.body.weekendFrom,
        weekendTo: req.body.weekendTo
    }
    const values = req.body;
    values.availability = availability;
    try {
        let alumni_id = req.params.id;
        const data = await Alumni.findByIdAndUpdate(alumni_id, values);
        res.status(200).json({
            data: data,
            message: "Record updated successfully",
        });
    } catch (exception) {
        console.log(exception);
        res.status(500).json({
            error: exception,
            message: "Something went wrong",
        });
    }
}

async function Read(req, res) {
    const queryString = req.body.query
    try {
        const data = await Alumni.find({name: {$regex: '*' + queryString, $options: 'i'}});
        res.status(200).json({
            data: data,
            message: "Alumnis fetched successfully",
        });
    } catch (exception) {
        console.log(exception);
        res.status(500).json({
            error: exception,
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
            error: exception,
            message: "Something went wrong",
        });
    }
}

async function ReadByEmail(req, res) {
    try{
        const studentEmail = res.locals.email
        const data = await Alumni.findOne({email: studentEmail})
        res.status(200).json({
            data: data,
            message: "Alumni fetched successfully",
        });
    } catch (exception) {
        console.log(exception);
        res.status(500).json({
            error: exception,
            message: "Something went wrong",
        });
    }
}

async function FilterByInterest(req, res){
    const interest = req.body.interest;
    try{
        const alumniData = await Alumni.find({interest: interest})
        res.status(200).json({
            data: alumniData,
            message: "Suggested Alumni fetched successfully",
        });
    }
    catch (exception) {
        console.log(exception);
        res.status(500).json({
            error: exception,
            message: "Something went wrong",
        });
    }
}

async function getTodaySession(req, res){
    try{
        const alumniID = req.body.alumniID
        const today = new Date().toISOString().slice(0, 10)
        const alumniData = await Session.find({date: {$eq: today}, alumni: {$eq: req.body.alumniID}}).populate('student')
        res.status(200).json({
            data: alumniData,
            message: "Todays session",
        });
    }
    catch (exception) {
        console.log(exception);
        res.status(500).json({
            error: exception,
            message: "Something went wrong",
        });
    }
}

async function getPastSession(req, res){
    try{
        const alumniID = req.body.alumniID
        const today = new Date().toISOString().slice(0, 10)
        const alumniData = await Session.find({date: {$eq: today}, alumni: {$eq: req.body.alumniID}}).populate('student')
        res.status(200).json({
            data: alumniData,
            message: "Todays session",
        });
    }
    catch (exception) {
        console.log(exception);
        res.status(500).json({
            error: exception,
            message: "Something went wrong",
        });
    }
}

module.exports = { Create, Update, Read, ReadByID, ReadByEmail, FilterByInterest, getTodaySession, getPastSession };
