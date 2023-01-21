const alumniController = require("../controller/alumni")
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Alumni router");
})

router.post('/create/', alumniController.Create)

router.post('/get/', alumniController.Read)

router.get('/get/:id', alumniController.ReadByID)

router.post('/update/:id', alumniController.Update)

router.post('/find/', alumniController.ReadByEmail);

router.post('/suggested/', alumniController.FilterByInterest);

router.search('/search', (req, res) => {
    res.send("search and filter alumni here")
})

router.post('/today/', alumniController.getTodaySession);
router.post('/past/', alumniController.getPastSession);

module.exports = router;
