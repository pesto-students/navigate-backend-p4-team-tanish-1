const axios = require("axios");
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
    const id = req.body.id
    const data = await Session.find({_id: {$eq: id}});
    console.log(data);

    const URL = `/meetings/${meetingID}/participants`
    const body = {
        "name": "Mary Sue",
        "picture": "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfDJ8MHx8&auto=format&fit=crop&w=500&q=60",
        "preset_name": "navigate-session",
        "client_specific_id": "string"
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

module.exports = { dyteCreateMeeting, addParticipant }