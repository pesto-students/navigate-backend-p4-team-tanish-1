const axios = require("axios");
const session = require("../models/session");
const Session = require("../models/session")

const DYTE_HOST = "https://api.cluster.dyte.in/v2"
const USERNAME = process.env.DYTE_ORGANIZATION_ID
const PASSWORD = process.env.DYTE_API_KEY

const DYTE_CLIENT = axios.create({
    baseURL: DYTE_HOST
})

async function dyteCreateMeeting(topic){
    const body = {
        "title": topic,
        "preferred_region": "ap-south-1",
        "record_on_start": true
    }
    try{
        const response = await DYTE_CLIENT.post("/meetings", body, {
            auth: {
                username: USERNAME,
                password: PASSWORD
            }
        })
        return response
    }
    catch(error){
        console.log(error);
        return error;
    }
}

async function addParticipant(req, res){
    try{
        const {name, userID} = req.body
        const data = await Session.findById(req.body.id);
        const meetingID = data.meetingID;
        data.participants.push(req.body.name)
        data.save()
        
        const URL = `/meetings/${meetingID}/participants`
        const body = {
            "name": name,
            "picture": "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfDJ8MHx8&auto=format&fit=crop&w=500&q=60",
            "preset_name": "navigate-session",
            "client_specific_id": userID
        }
        const response = await DYTE_CLIENT.post(URL, body, {
            auth: {
                username: USERNAME,
                password: PASSWORD
            }
        })
        res.status(200).json({
            data: response.data,
            message: "Participant added"
        })
    }
    catch(exception){
        const error = exception.response.data;
        if(error.error.code === 409){
            res.status(409).json({
                message: "Participant has already registered to meeting",
                error: error
            })
        }
        else{
            res.status(500).json({
                message: "something went wrong"
            })
        }
    }
}

module.exports = { dyteCreateMeeting, addParticipant }