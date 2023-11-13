import http from "http";
import app from "./config/express.config.js";



const appServer = http.createServer(app);

appServer.listen(3000, async () => {
    console.log("Listening on port 3000");
})
