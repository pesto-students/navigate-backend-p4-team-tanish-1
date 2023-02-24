const admin = require("firebase-admin");
const FIREBASE_PATH = process.env.FIREBASE_PRIVATE_PATH
const serviceAccount = require(FIREBASE_PATH);

// Initialize firebase app
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

// verify token in request headers
async function verifyToken(req, res, next) {
    try{
        // Fetch token from header
        if(req.headers.authorization)
            auth_token = req.headers.authorization.split(' ')[1];
        else
            res.status(400).json({message: "Bad Request. Token not found"})
        
        // Verify token using firebase auth
        let resp = await admin.auth().verifyIdToken(auth_token)
        const userEmail = resp.email;
        res.locals.email = userEmail;
        next();
    }

    // token expired or any issue occured
    catch (err) {
        console.log(err);
        res.status(401);
        return next('Unauthorized');
    }
}

module.exports = verifyToken