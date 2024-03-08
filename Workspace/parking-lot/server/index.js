const express = require('express');
const bodyParser = require('body-parser');
const compression = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const moment = require('moment');
const _ = require("lodash");
const app = express();
const port = 8000;

app.use(cors({ origin: "*" })); // Cross-Origin Resource Sharing
app.use(compression()); // compress to enhance functionality
app.use(cookieParser()); // parse cookies automatically - req.cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const multer = require('multer');
const upload = multer({ dest: './public/' }); // Configure multer to upload files to the 'uploads' directory



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


let userType = ["manager", "customer"]
let secretToken = ["secretTokenForManager", "secretTokenForCustomer"]
let slots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "1:00 AM - 2:00 PM",
    "2:00 AM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM",
]
let bookedSlotsAfterThreePM = [
    "3:00 PM - 4:00 PM",
    "6:00 PM - 7:00 PM",
    "7:00 PM - 8:00 PM",
    "10:00 PM - 11:00 PM"
]

let bookedSlotsBeforeThreePM = [
    "12:00 PM - 1:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
]
let bookedSlotsTwoDaysLater = [
    "9:00 AM - 10:00 AM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM",
]
let timeToSlotsMapping = {
    "9:00 AM - 10:00 AM": 2,
    "10:00 AM - 11:00 AM": 10,
    "11:00 AM - 12:00 PM": 10,
    "12:00 PM - 1:00 PM": 10,
    "1:00 AM - 2:00 PM": 10,
    "2:00 AM - 3:00 PM": 10,
    "3:00 PM - 4:00 PM": 10,
    "4:00 PM - 5:00 PM": 10,
}
let bookings = [{
    carNumber: "ABCD",
    id: 1,
    userName: "user1",
    email: "one@g.co",
    phone: "989xxxxxxxx",
    slot: "12:00 PM - 1:00 PM"
}, {
    carNumber: "EFGH",
    id: 2,
    userName: "user2",
    email: "two@g.co",
    phone: "988xxxxxxxx",
    slot: "9:00 AM - 10:00 AM"
}, {
    carNumber: "MNO",
    id: 4,
    userName: "user4",
    email: "four@g.co",
    phone: "986xxxxxxxx",
    slot: "9:00 AM - 10:00 AM"
}, {
    carNumber: "PQR",
    id: 5,
    userName: "user5",
    email: "five@g.co",
    phone: "985xxxxxxxx",
    slot: "9:00 AM - 10:00 AM"
}, {
    carNumber: "M4K4L1",
    id: 6,
    userName: "user6",
    email: "six@g.co",
    phone: "985xxxxxxxx",
    slot: "9:00 AM - 10:00 AM"
}, {
    carNumber: "PQR",
    id: 5,
    userName: "user5",
    email: "five@g.co",
    phone: "985xxxxxxxx",
    slot: "9:00 AM - 10:00 AM"
}]
let threePM = null
let firstHalfOfDay = null
let secondHalfOfDay = null
let twoDaysLaterCheck = null
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
            responseObj = { success: true, message: 'OTP verified successfully', type: type, name: "MANAGER", display: 0, login: true, secretToken: secretToken[0], userId: 0 };
        } else {
            responseObj = { success: true, message: 'OTP verified successfully', type: type, name: "CUSTOMER", display: 1, login: true, secretToken: secretToken[1], userId: 1 };
        }
    } else {
        responseObj = { success: true, message: 'OTP verified successfully', login: false };
    }
    res.status(200).send(responseObj);
});

app.get('/v1/slots', (req, res) => {
    const { date, location } = req.query;
    console.log('date', date, 'location', location);
    threePM = moment().set({ hour: 15, minute: 0, second: 0, millisecond: 0 });
    firstHalfOfDay = moment(date).isBefore(threePM)
    secondHalfOfDay = moment(date).isAfter(threePM)
    twoDaysLaterCheck = moment(date).isBefore(moment().add(2, 'days'));

    let finalSlots = [];
    if (firstHalfOfDay) {
        finalSlots = [...bookedSlotsBeforeThreePM]
    } else if (secondHalfOfDay) {
        finalSlots = [...bookedSlotsAfterThreePM]
    } else if (twoDaysLaterCheck) {
        finalSlots = [...bookedSlotsTwoDaysLater]
    }

    res.status(200).send(finalSlots);
});

app.post('/v1/slots', (req, res) => {
    const { date, location, slot } = req.body;

    if (firstHalfOfDay) {
        finalSlots = bookedSlotsBeforeThreePM.filter(slotH => slot == slotH)
    } else if (secondHalfOfDay) {
        finalSlots = bookedSlotsAfterThreePM.filter(slotH => slot == slotH)
    } else if (twoDaysLaterCheck) {
        finalSlots = bookedSlotsTwoDaysLater.filter(slotH => slot == slotH)
    }

    res.status(200).send({ success: true, message: "Booking made successfully", slot, date, location, bookingDone: true });


});

app.get('/v1/slots/available', (req, res) => {
    console.log('req.query', req.query);
    const { date, location, slot } = req.body;
    let bookedSlots = []
    if (moment(date).isBefore(moment().add(2, 'days'))) {
        bookedSlots = [...bookedSlotsTwoDaysLater];
    } else {
        bookedSlots = [...bookedSlotsBeforeThreePM, ...bookedSlotsAfterThreePM]
    }

    let availableSlots = _.difference(slots, bookedSlots);


    res.status(200).send({ success: true, message: "Bookings fetched successfully", availableSlots, bookedSlots, date });


});

app.post('/v1/image', upload.single('image'), (req, res) => {
    console.log('req.file', req.file);
    const headers = req.get("Authorization");
    const userId = headers.split(',')[0]


    // +++++++++ read the file using Tesseract npm package
    // const conversation = await tesseract.recognize(req.file.path, "eng");
    // +++++++++ for demo we just say that the car number plate had this "M4KAL1"

    // With user id find booking from the database
    // Now, get the user information  
    // send another booking to user
    // use the cae number fetched from tesseract to find this user
    // trigger a notification to this user that they have overstayed their welcome
    // trigger a notification to the manager about the incident

    res.status(200).send({ success: true, message: "Apologies booking re-made successfully", slot: "Same as before", location: "Same as before" });


});
