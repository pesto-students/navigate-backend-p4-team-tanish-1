const meetingController = require("../controller/meeting")
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Meeting router");
})

router.post('/join/', meetingController.addParticipant)

module.exports = router;
