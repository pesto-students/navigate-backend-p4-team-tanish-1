// import required modules
const axios = require("axios");
const Session = require("../models/session")

// dyte secrets
const DYTE_HOST = "https://api.cluster.dyte.in/v2"
const USERNAME = process.env.DYTE_ORGANIZATION_ID
const PASSWORD = process.env.DYTE_API_KEY

// create dyte client
const DYTE_CLIENT = axios.create({
    baseURL: DYTE_HOST
})

// create meeting using REST API
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

// Add participant to meeting and return token to participant
async function addParticipant(req, res){
    try{
        const {name, userID, image} = req.body
        const data = await Session.findById(req.body.id);
        const meetingID = data.meetingID;
        data.participants.push(req.body.name)
        data.save()
        
        // First check if participant already exist in meeting
        const URL = `/meetings/${meetingID}/participants`
        const response = await DYTE_CLIENT.get(URL, {
            auth: {
                username: USERNAME,
                password: PASSWORD
            }
        })
        const participantsData = response.data.data;
        
        let refreshParticipant = false;
        for(const participant of participantsData){
            if(participant['custom_participant_id'] === userID){
                // participant already exists in meeting then refresh user's token
                const participant_id = participant['id']
                const URL = `/meetings/${meetingID}/participants/${participant_id}/token`
                const response = await DYTE_CLIENT.post(URL, {}, {
                    auth: {
                        username: USERNAME,
                        password: PASSWORD
                    }
                })
                refreshParticipant = true
                res.status(200).json({
                    data: response.data,
                    message: "Participant added"
                })
                break
            }
        }

        // If participant not already present in meeting add participant
        if(!refreshParticipant){
            const URL = `/meetings/${meetingID}/participants`
            const body = {
                "name": name,
                "picture": image,
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