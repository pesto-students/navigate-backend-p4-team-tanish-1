// Import schema and create router
const sessionController = require("../controller/session")
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Session router");
})

// create session
router.post('/create/', sessionController.Create);

// upcoming session for alumni and student
router.post('/upcoming/student/', sessionController.getUpcomingForStudent);
router.post('/upcoming/alumni/', sessionController.getUpcomingForAlumni);

// available slot of alumni
router.post('/slots', sessionController.getAvailableSlots);

module.exports = router