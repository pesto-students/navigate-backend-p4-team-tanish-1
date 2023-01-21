const Alumni = require("../models/alumni");
const Session = require("../models/session");
const { getImage } = require("./common");

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
    const queryString = req.query.q
    const regExp = new RegExp(queryString, 'i')
    try {
        const data = await Alumni.find({name: {$regex: regExp}});
        for(let record of data){
            record.image = record.image ? getImage(record.image) : null
        }
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
        data.image = data.image ? getImage(data.image) : null
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
        if(data === null){
            res.status(404).json({
                message: "User Not Found"
            })
        }
        else{
            data.image = data.image ? getImage(data.image) : null
            res.status(200).json({
                data: data,
                message: "Alumni fetched successfully",
            });
        }
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
        const data = await Alumni.find({interest: interest})
        for(let record of data){
            record.image = record.image ? getImage(record.image) : null
        }
        res.status(200).json({
            data: data,
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
        const today = new Date("2023-01-24").toISOString().slice(0, 10)
        const alumniData = await Session.find({date: {$eq: today}, alumni: {$eq: req.body.alumniID}}).populate('student')
        let studentsImageFetched = []
        for(let record of alumniData){
            if(!studentsImageFetched.includes(record.student._id)){
                studentsImageFetched.push(record.student._id)
                record.student.image = record.student.image ? getImage(record.student.image) : null
            }
        }
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
        const userName = req.body.name
        const alumniID = req.body.alumniID
        const today = new Date("2023-01-24").toISOString().slice(0, 10)
        const alumniData = await Session.find({participants: userName, alumni: {$eq: req.body.alumniID}}).populate('student')
        let studentsImageFetched = []
        for(let record of alumniData){
            if(!studentsImageFetched.includes(record.student._id)){
                studentsImageFetched.push(record.student._id)
                record.student.image = record.student.image ? getImage(record.student.image) : null
            }
        }
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
