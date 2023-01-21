const AWS = require('aws-sdk');
const fs = require('fs');
const alumni = require('../models/alumni');
const student = require('../models/student');

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new AWS.S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region:region
});

async function uploadFile(req, res){
    const userID = req.body.userID;
    let userData;
    userData = await student.findById(userID);
    if(userData === null){
        userData = await alumni.findById(userID);
    }
    console.log(userData);
    if (req.file == null) {
        return res.status(400).json({ 'message': 'Please choose the file' })
    }
    var file = req.file
    const uploadToS3 = (file) => {
        const fileStream = fs.createReadStream(file.path);
        const params = {
            Bucket: bucketName,
            Key: file.originalname,
            Body: fileStream
        };
        s3.upload(params, function (err, data) {
            if (err) {
                throw err
            }
            processUploadedData(res, data, userData);
            console.log(`Image uploaded successfully ${data.Location}`);
        });
    }
    uploadToS3(file);
}

async function processUploadedData (res, data, userData){
    const url = getImage(data['Key']);
    userData.image = data['Key']
    await userData.save();
    res.status(200).json({
        imageKey: data['Key'],
        imageSrc: url
    })
}
function getImage(key){
    if(key === undefined){
        return undefined
    }
    try{
        const url = s3.getSignedUrl('getObject', {
            Bucket: bucketName,
            Key: key,
            Expires: 3600
        })
        return url
    }
    catch(error) { 
        console.log(error);
    }
}

module.exports = { uploadFile, getImage }