const sessionController = require("../controller/session")
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Session router");
})

router.post('/create/', sessionController.Create);
router.post('/upcoming/student/', sessionController.getUpcomingForStudent);
router.post('/upcoming/alumni/', sessionController.getUpcomingForAlumni);
router.post('/slots', sessionController.getAvailableSlots);

module.exports = router