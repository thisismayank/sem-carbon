import asyncRedis from "async-redis";

import { redisConfig } from "../config";
import BaseClass from "./base.class.js";

const redisClient = asyncRedis.createClient(redisConfig.port, redisConfig.host);

export default class AuthClass extends BaseClass {

    constructor(connection, redis) {
        super(null, null, redis);
    }

    async sendTokenForEmailVerification(email) {
        try {
            logger.info(
                `INFO: AuthClass-sendTokenForEmailVerification - Email: ${email}`
            );

            await redisClient.set("EMAIL_CMU", 112233);
            return { email: true };
        } catch (error) {
            logger.error(`ERROR: AuthClass-sendTokenForEmailVerification - ${error}`);
            throw error;

        }
    }
}