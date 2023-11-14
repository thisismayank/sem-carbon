import asyncRedis from "async-redis";

import { redisConfig } from "../config";
import BaseClass from "./base.class.js";

import logger from "../lib/logger";
import response from "../lib/response.js";

import * as CNaught from "../lib/cnaught";

const redisClient = asyncRedis.createClient(redisConfig.port, redisConfig.host);

export default class CarbonClass extends BaseClass {

    constructor(connection, redis) {
        super(null, null, redis);
    }

    async placeOrder(amountInKg) {
        try {
            logger.info(
                `INFO: AuthClass-placeOrder - Amount in KG: ${amountInKg}`
            );
            const orderPlaceStatus = await CNaught.placeOrder(amountInKg);

            if (!orderPlaceStatus.status) {
                return {
                    ...response.CARBON.CNAUGHT.PLACE_ORDER.FAILURE,
                    messageObj: {
                        error: "Some error occured in order placement"
                    }
                }
            }

            return {
                ...response.CARBON.CNAUGHT.PLACE_ORDER.SUCCESS,
                results: {
                    ...orderPlaceStatus
                }
            }
        } catch (error) {
            logger.error(`ERROR: AuthClass-sendTokenForEmailVerification - ${error}`);
            throw error;

        }
    }
}