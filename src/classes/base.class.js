import asyncRedis from "async-redis";

import { redisConfig } from "../config";

// Establishing redis connection
const redisClient = asyncRedis.createClient(redisConfig.port, redisConfig.host);

export default class BaseClass {
    constructor(name, connection, redis) {
        if (redisClient) {
            this.redis = redisClient;
        }
    }
}
