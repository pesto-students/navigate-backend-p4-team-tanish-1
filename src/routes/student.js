const studentController = require("../controller/student")
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send("Student router");
})

router.post('/create/', studentController.Create);

router.post('/update/:id/', studentController.Update);

router.post('/find/', studentController.ReadByEmail);

router.get('/get/', studentController.Read);

router.get('/get/:id/', studentController.ReadByID);

module.exports = router;
