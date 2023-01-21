const admin = require("firebase-admin");
const FIREBASE_PATH = process.env.FIREBASE_PRIVATE_PATH
const serviceAccount = require(FIREBASE_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})
async function verifyToken(req, res, next) {
    try{
        auth_token = req.headers.authorization.split(' ')[1];
        let resp = await admin.auth().verifyIdToken(auth_token)
        const userEmail = resp.email;
        res.locals.email = userEmail;
        next();
    }
    catch (err) {
        console.log(err);
        res.status(401);
        return next('Unauthorized');
    }
}

module.exports = verifyToken