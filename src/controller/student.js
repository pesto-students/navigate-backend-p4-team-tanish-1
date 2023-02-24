// import modules
const Student = require("../models/student");
const {getImage} = require("./common");

// Create student
async function Create(req, res) {
    try {
        const studentObj = new Student(req.body);
        const savedObj = await studentObj.save();
        res.status(200).json({
            data: savedObj,
            message: "Data saved to database",
        });
    } 
    catch(exception) {
        let message = "Something went wrong"
        if(exception.code === 1100){
            message = "Email Already registered"
        }
        res.status(500).json({
            error: exception,
            message: message
        });
    }
}


// Update student
async function Update(req, res) {
    try {
        let student_id = req.params.id;
        const data = await Student.findByIdAndUpdate(student_id, req.body);
        res.status(200).json({
            data: data,
            message: "Record updated successfully",
        });
    } catch (exception) {
        console.log(exception);
        res.status(500).json({
            error: exception,
            message: "Something went wrong",
        });
    }
}

// Get student
async function Read(req, res) {
    try {
        const data = await Student.find();
        res.status(200).json({
            data: data,
            message: "Students fetched successfully",
        });
    } catch (exception) {
        console.log(exception);
        res.status(500).json({
            error: exception,
            message: "Something went wrong",
        });
    }
}

// read student by ID
async function ReadByID(req, res) {
    try {
        const student_id = req.params.id
        const data = await Student.findById(student_id);
        data.image = data.image ? getImage(data.image) : null
        res.status(200).json({
            data: data,
            message: "Student fetched successfully",
        });
    } catch (exception) {
        console.log("Exception", exception);
        res.status(500).json({
            error: exception,
            message: "Something went wrong",
        });
    }
}

// get student by email
async function ReadByEmail(req, res) {
    try{
        const studentEmail = res.locals.email
        const data = await Student.findOne({email: studentEmail})
        if(data === null){
            res.status(404).json({
                message: "User Not Found"
            })
        }
        else{
            data.image = data.image ? getImage(data.image) : null
            res.status(200).json({
                data: data,
                message: "Student fetched successfully",
            });
        }
    } catch (exception) {
        console.log(exception);
        res.status(500).json({
            error: exception,
            message: "Something went wrong",
        });
    }
}

module.exports = { Create, Update, Read, ReadByID, ReadByEmail };
