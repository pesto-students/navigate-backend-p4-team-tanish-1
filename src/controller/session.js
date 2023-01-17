const Session = require("../models/session");
const Student = require("../models/student");
const dyteController = require("./meeting");

async function Create(req, res) {
    try {
        const response = await dyteController.dyteCreateMeeting(req.body.topic)
        dyteResponse = response["data"];
        const data = {...req.body, meetingID: dyteResponse["data"]["id"]};
        console.log(data);
        const sessionObj = new Session(data);
        const savedObj = await sessionObj.save();
        res.status(200).json({
            data: savedObj,
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

async function getRecent(req, res){
    try{
        const studentEmail = res.locals.studentEmail
        const studentID = req.body.studentID
        const sessionData = await Session.find({studentID: {$eq: studentID}}).sort({date: 1, from: 1});
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

module.exports = { Create, getRecent };
