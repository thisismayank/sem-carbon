import express from "express";

const app = express();

app.get("/", (req, res) => res.send("This is team Green - presenting a carbon credit based solution"));

app.listen(3000, async () => {
    console.log("Server initiated successfully on port 3000");

})