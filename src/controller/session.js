const Session = require("../models/session");
const dyteController = require("./meeting");
const paymentController = require("./payments");

async function Create(req, res) {
    try {
        const response = await dyteController.dyteCreateMeeting(req.body.topic)
        dyteResponse = response["data"];
        const data = {...req.body, meetingID: dyteResponse["data"]["id"]};
        const order = await paymentController.createOrder(req.body.amount);
        const sessionObj = new Session(data);
        const savedObj = await sessionObj.save();
        res.status(200).json({
            data: savedObj,
            order: order,
            message: "Data saved to database",
        });
    } 
    catch(exception) {
        console.log(exception);
        let message = "Something went wrong"
        res.status(500).json({
            data: null,
            message: message
        });
    }
}

async function getUpcomingForStudent(req, res){
    try{
        const studentEmail = res.locals.studentEmail
        const studentID = req.body.studentID
        const sessionData = await Session.find({student: {$eq: studentID}}).sort({date: 1, from: 1}).populate('alumni');
        const upcomingSession = sessionData[0]
        res.status(200).json({
            data: upcomingSession,
            message: "Upcoming session",
        });
    } 
    catch(exception) {
        console.log(exception);
        let message = "Something went wrong"
        res.status(500).json({
            data: null,
            message: message
        });
    }
}

async function getUpcomingForAlumni(req, res){
    try{
        const alumniEmail = res.locals.alumniEmail
        const alumniID = req.body.alumniID
        const sessionData = await Session.find({alumniID: {$eq: alumniID}}).sort({date: 1, from: 1}).populate('student');;
        const upcomingSession = sessionData[0]
        res.status(200).json({
            data: upcomingSession,
            message: "Upcoming session",
        });
    } 
    catch(exception) {
        let message = "Something went wrong"
        res.status(500).json({
            data: null,
            message: message
        });
    }
}

async function getAvailableSlots(req, res) {
    try{
        const body = req.body;
        res.status(200).json({
            data:body,
            message: "Fetched available slots"
        })
    }
    catch(exception){
        console.log(exception);
        res.status(500).json({
            error: exception,
            message: "Something went wrong"
        })
    }
}

module.exports = { Create, getUpcomingForStudent, getUpcomingForAlumni, getAvailableSlots };
