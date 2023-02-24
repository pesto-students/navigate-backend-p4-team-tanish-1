// importing modules
const Session = require("../models/session");
const Alumni = require("../models/alumni");
const dyteController = require("./meeting");
const paymentController = require("./payments");
const { getImage } = require("./common");

// Create session
async function Create(req, res) {
    try {
        // creating dyte meeting
        const response = await dyteController.dyteCreateMeeting(req.body.topic)
        dyteResponse = response["data"];
        const amount = parseInt(req.body.amount)
        const isPaid = amount > 0
        const data = {...req.body, meetingID: dyteResponse["data"]["id"], paid: isPaid};
        const sessionObj = new Session(data);
        sessionObj.at = new Date(`${sessionObj.date}T${sessionObj.from}Z`).getTime()
        const savedObj = await sessionObj.save();
        
        // If paid session then create order
        if(isPaid){
            const order = await paymentController.createOrder(amount);
            const updateSavedData = await Session.findOneAndUpdate({_id: savedObj._id},{orderID: order.id})
            res.status(200).json({
                data: savedObj,
                order: order,
                paymentRequired: true,
                message: "Data saved to database",
            });
        }
        else{
            res.status(200).json({
                data: savedObj,
                order: [],
                paymentRequired: false,
                message: "Data saved to database",
            });
        }
    } 
    catch(exception) {
        console.log(exception);
        let message = "Something went wrong"
        res.status(500).json({
            error: exception,
            message: message
        });
    }
}

// Fetch upcoming sessions for student
async function getUpcomingForStudent(req, res){
    try{
        const studentID = req.body.studentID
        const today = new Date().getTime()
        // Filter session in nearest future
        const sessionData = await Session.find({student: {$eq: studentID}, at: {$gte: today}}).sort({at: 1}).populate('alumni');
        if(sessionData.length === 0) {
            res.status(200).json({
                message: "No Upcoming session",
            })
        }
        else {
            // Get presigned url
            let upcomingSession = sessionData[0];
            upcomingSession.alumni.image = upcomingSession.alumni.image ? getImage(upcomingSession.alumni.image) : null
            res.status(200).json({
                data: upcomingSession,
                message: "Upcoming session",
            });
        }
    } 
    catch(exception) {
        console.log(exception);
        let message = "Something went wrong"
        res.status(500).json({
            error: exception,
            message: message
        });
    }
}

// Fetch upcoming for alumni
async function getUpcomingForAlumni(req, res){
    try{
        const alumniID = req.body.alumniID
        const today = new Date().getTime()
        // Filter session in nearest future
        const sessionData = await Session.find({alumni: {$eq: alumniID}, at: {$gte: today}}).sort({at: 1}).populate('student');
        if(sessionData.length === 0){
            res.status(200).json({
                message: "No Upcoming session",
            })
        }
        else{
            // get presigned url
            let upcomingSession = sessionData[0]
            upcomingSession.student.image = upcomingSession.student.image ? getImage(upcomingSession.student.image) : null
            res.status(200).json({
                data: upcomingSession,
                message: "Upcoming session",
            });
        }
    } 
    catch(exception) {
        console.log(exception);
        let message = "Something went wrong"
        res.status(500).json({
            error: exception,
            message: message
        });
    }
}

// Find available slots for alumni
async function getAvailableSlots(req, res) {
    try{
        const body = req.body;
        const date = body.date; // Selected date in REST API
        const todayDate = new Date();
        const dateString = new Date(date).toISOString().slice(0, 10);
        const dateObj = new Date(date)
        
        // Bad request
        if(body.alumniID === undefined | date === undefined){
            res.status(400).json({
                data:{"from": [], "to": []},
                message: "Invalid data"
            })
        }
        
        // If date is in past
        else if(dateObj <= todayDate){
            res.status(200).json({
                data:{"from": [], "to": []},
                message: "Fetched available slots"
            })
        }

        // Selected date is valid
        else{
            // check if day is weekend or weekday
            const isWeekend = dateObj.getDay() % 6 === 0;
            const alumniData = await Alumni.findById(req.body.alumniID);
            
            // get start time end time based on day
            let startTime, endTime
            if(isWeekend){
                startTime = parseInt(alumniData.weekendsFrom.split(":")[0]);
                endTime = parseInt(alumniData.weekendsTo.split(":")[0]);
            }
            else{
                startTime = parseInt(alumniData.weekdaysFrom.split(":")[0]);
                endTime = parseInt(alumniData.weekdaysTo.split(":")[0]);
            }

            // create options based on available time
            let fromOptions = []
            while(startTime < endTime){
                fromOptions.push(startTime < 10 ? "0" + startTime.toString() + ":00" : startTime.toString() + ":00");
                startTime++;
            }
            // get already scheduled meeting
            const meetingData = await Session.find({date: {$eq: dateString}, alumni: {$eq: req.body.alumniID}}).sort({from: 1})
            
            // Filter only available time slot
            for(const meeting of meetingData){
                startsFrom = meeting['from'];
                endsAt = meeting['to'];
                startsFromInt = parseInt(startsFrom.split(":")[0])
                endsAtInt = parseInt(endsAt.split(":")[0])
                while(startsFromInt < endsAtInt){
                    let ind = fromOptions.indexOf(startsFrom);
                    ind > -1 ? fromOptions.splice(ind, 1) : fromOptions;
                    startsFromInt++;
                    startsFrom = startsFromInt.toString()
                    startsFrom = startsFrom < 10 ? "0" + startsFrom + ":00" : startsFrom + ":00"
                }
            }
            res.status(200).json({
                data:{"from": fromOptions},
                message: "Fetched available slots"
            })
        }
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
