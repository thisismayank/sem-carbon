import asyncRedis from "async-redis";

import { redisConfig } from "../config";
import BaseClass from "./base.class.js";

import logger from "../lib/logger";
import response from "../lib/response.js";

import * as CNaught from "../lib/cnaught";
import CarbonModel from "../models/carbon.model.js";
const redisClient = asyncRedis.createClient(redisConfig.port, redisConfig.host);

export default class CarbonClass extends BaseClass {

    constructor(connection, redis) {
        super(CarbonModel.collection.name, connection, redis);
        this.schema = CarbonModel.schema;
        this.name = CarbonModel.collection.name;
        this.model = CarbonModel;
    }

    async placeOrder(userId, amountInKg) {
        try {
            logger.info(
                `INFO: AuthClass-placeOrder - User ID: ${userId} - Amount in KG: ${amountInKg}`
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

            await CarbonModel.create({
                userId,
                transactionId: orderPlaceStatus.id,
                amountInKg: orderPlaceStatus.amountInKg,
                priceInCentsUSD: orderPlaceStatus.priceInCentsUSD,
                orderNumber: orderPlaceStatus.orderNumber,
                certificateUrl: orderPlaceStatus.certificateUrl,
                downloadUrl: orderPlaceStatus.downloadCertificateUrl,
            })

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
    async getListOfOrders(userId) {
        try {
            logger.info(
                `INFO: AuthClass-getListOfOrders - User ID: ${userId}`
            );
            const listOfOrders = await CarbonModel.find({ userId }).lean()


            return {
                ...response.CARBON.CNAUGHT.PLACE_ORDER.SUCCESS,
                results: {
                    listOfOrders
                }
            }
        } catch (error) {
            logger.error(`ERROR: AuthClass-getListOfOrders - ${error}`);
            throw error;

        }
    }
}