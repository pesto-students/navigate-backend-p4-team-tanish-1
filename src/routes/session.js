const sessionController = require("../controller/session")
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Session router");
})

router.post('/create/', sessionController.Create);
router.post('/upcoming/', sessionController.getRecent);

module.exports = router