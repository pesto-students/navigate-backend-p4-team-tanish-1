const Student = require("../models/student");

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
            data: null,
            message: message
        });
    }
}

async function Update(req, res) {
    console.log(req.body);
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
            data: exception,
            message: "Something went wrong",
        });
    }
}

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
            data: exception,
            message: "Something went wrong",
        });
    }
}

async function ReadByID(req, res) {
    try {
        const student_id = req.params.id
        const data = await Student.findById(student_id);
        res.status(200).json({
            data: data,
            message: "Student fetched successfully",
        });
    } catch (exception) {
        console.log(exception);
        res.status(500).json({
            data: exception,
            message: "Something went wrong",
        });
    }
}

async function ReadByEmail(req, res) {
    try{
        const studentEmail = res.locals.email
        const data = await Student.findOne({email: studentEmail})
        res.status(200).json({
            data: data,
            message: "Student fetched successfully",
        });
    } catch (exception) {
        console.log(exception);
        res.status(500).json({
            data: exception,
            message: "Something went wrong",
        });
    }
}

module.exports = { Create, Update, Read, ReadByID, ReadByEmail };
