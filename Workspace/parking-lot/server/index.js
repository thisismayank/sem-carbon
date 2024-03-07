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


