const express = require('express');
const bodyParser = require('body-parser');
const compression = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const port = 8000;

app.use(cors({ origin: "*" })); // Cross-Origin Resource Sharing
app.use(compression()); // compress to enhance functionality
app.use(cookieParser()); // parse cookies automatically - req.cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


let userType = ["manager", "customer"]
let secretToken = ["secretTokenForManager", "secretTokenForCustomer"]
app.post('/v1/email', (req, res) => {
    console.log('req', req.body)
    const { email } = req.body;
    console.log('Received email:', email);
    let responseObj = { success: '', message: '', email, otp: '' }
    if (email.includes("mayank")) {
        responseObj = {
            success: true, message: 'Email received successfully', email, otp: "******", isLogin: true, type: userType[0]
        }
    } else if (email.includes("testuser")) {
        responseObj = { success: true, message: 'Email received successfully', email, otp: "******", isLogin: true, type: userType[1] };
    } else {
        responseObj = {
            success: true, message: 'Email received successfully', email, otp: "******", isLogin: false, type: userType[1]
        };
    }
    res.status(200).send(responseObj)
});


app.post('/v1/email/verify', (req, res) => {
    const { otp, isLogin, type } = req.body;
    let responseObj = {}
    if (otp !== '112233') {


        res.status(400).send({ success: false, message: 'Invalid OTP, please try again', otp });
    }
    if (isLogin) {
        if (type === userType[0]) {
            responseObj = { success: true, message: 'OTP verified successfully', type: type, name: "MANAGER", display: 0, login: true, secretToken: secretToken[0] };
        } else {
            responseObj = { success: true, message: 'OTP verified successfully', type: type, name: "CUSTOMER", display: 1, login: true, secretToken: secretToken[1] };
        }
    } else {
        responseObj = { success: true, message: 'OTP verified successfully', login: false };
    }
    res.status(200).send(responseObj);
});

