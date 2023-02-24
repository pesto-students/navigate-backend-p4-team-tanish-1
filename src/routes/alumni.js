// Import schema and create router
const alumniController = require("../controller/alumni")
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Alumni router");
})

// Create, Read and update API for alumni
router.post('/create/', alumniController.Create);
router.get('/get/', alumniController.Read);
router.get('/get/:id', alumniController.ReadByID);
router.post('/update/:id', alumniController.Update);
router.post('/find/', alumniController.ReadByEmail);

// Filter by interests
router.post('/suggested/', alumniController.FilterByInterest);

// Fetch today's session for alumni
router.post('/today/', alumniController.getTodaySession);

// Fetch past session for alumni
router.post('/past/', alumniController.getPastSession);

module.exports = router;
