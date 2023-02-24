// Import schema
const Alumni = require("../models/alumni");
const Session = require("../models/session");
const { getImage } = require("./common");

// Create Alumni
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

// Update Alumni
async function Update(req, res) {
    // availability of alumni
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

// Search alumni
async function Read(req, res) {
    const queryString = req.query.q
    const regExp = new RegExp(queryString, 'i')
    try {
        const data = await Alumni.find({name: {$regex: regExp}});
        // if image is not set assign null
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

// Get alumni by ID
async function ReadByID(req, res) {
    try {
        const alumni_id = req.params.id
        const data = await Alumni.findById(alumni_id);
        
        // if image is not set assign null
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

// Get alumni by email
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

// Filter alumni by interest
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

// Get list of sessions scheduled today
async function getTodaySession(req, res){
    try{
        // today's date in DD-MM-YYYY format
        const today = new Date().toISOString().split('T')[0]
        
        // get timestamp
        const todayTimeStamp = new Date(today).getTime()
        const tomorrowTimeStamp = todayTimeStamp + 86400000
        
        // filter sessions
        const alumniData = await Session.find({at: {$gte: todayTimeStamp, $lte: tomorrowTimeStamp}, alumni: {$eq: req.body.alumniID}}).populate('student')
        let studentsImageFetched = []
        // get presigned URL for images in S3
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

// Fetch past sessions
async function getPastSession(req, res){
    try{
        // filter sessions with less than current timestamp
        const todayTimeStamp = new Date().getTime()
        const alumniData = await Session.find({at: {$lte: todayTimeStamp}, alumni: {$eq: req.body.alumniID}}).populate('student').sort({at: 1})
        let studentsImageFetched = []
        // get presigned url for all records
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
