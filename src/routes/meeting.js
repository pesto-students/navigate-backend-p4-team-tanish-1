// Import schema and create router
const meetingController = require("../controller/meeting")
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Meeting router");
})

// Get token to join meeting
router.post('/join/', meetingController.addParticipant)

module.exports = router;
