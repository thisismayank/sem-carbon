import http from "http";
import app from "./config/express.config.js";
import logger from "./lib/logger.js";
import { connectMongoose } from "./lib/mongoose.js";

const appServer = http.createServer(app);

appServer.listen(8000, async () => {
    logger.info("INFO: Listening on port 8000");
    await connectMongoose();

})
