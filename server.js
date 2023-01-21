if(process.env.NODE_ENV !== 'production')
    require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const middleWare = require("./src/middleware");

const studentRouter = require('./src/routes/student');
const alumniRouter = require('./src/routes/alumni');
const sessionRouter = require('./src/routes/session');
const meetingRouter = require('./src/routes/meeting');
const paymentRouter = require('./src/routes/payments');

const port = 4000;
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(cors());
app.use(middleWare)
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

app.use('/student', studentRouter);
app.use('/alumni', alumniRouter);
app.use('/booking', sessionRouter);
app.use('/meeting', meetingRouter);
app.use('/payment', paymentRouter);

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})