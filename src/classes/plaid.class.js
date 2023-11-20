import asyncRedis from "async-redis";

import { redisConfig } from "../config";
import BaseClass from "./base.class.js";

import logger from "../lib/logger";
import response from "../lib/response.js";
import * as Plaid from "../lib/plaid.js"
import * as CNaught from "../lib/cnaught";
import CarbonModel from "../models/carbon.model.js";
const redisClient = asyncRedis.createClient(redisConfig.port, redisConfig.host);

export default class PlaidClass extends BaseClass {

    constructor(connection, redis) {
        super(CarbonModel.collection.name, connection, redis);
        this.schema = CarbonModel.schema;
        this.name = CarbonModel.collection.name;
        this.model = CarbonModel;
    }

    async createLinkToken(userId) {
        try {
            logger.info(
                `INFO: AuthClass-createLinkToken - User ID: ${userId}`
            );
            const linkToken = await Plaid.createLinkToken(userId);
            console.log('PLAID CLASS ', linkToken)
            if (!linkToken.success) {
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
                    ...linkToken.createTokenResponseData
                }
            }
        } catch (error) {
            logger.error(`ERROR: AuthClass-createLinkToken - ${error}`);
            throw error;

        }
    }
    async exchangePublicToken(userId, publicToken) {
        try {
            logger.info(
                `INFO: AuthClass-exchangePublicToken - User ID: ${userId} - Public Token: ${publicToken}`
            );
            const publicTokenResponse = await Plaid.exchangePublicToken(publicToken);

            if (!publicTokenResponse.success) {
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
                    accessToken: publicTokenResponse.publicTokenResponseData.access_token
                }
            }
        } catch (error) {
            logger.error(`ERROR: AuthClass-exchangePublicToken - ${error}`);
            throw error;

        }
    }

    async getAccountData(userId, accessToken) {
        try {
            logger.info(
                `INFO: AuthClass-getAccountData - User ID: ${userId} - Public Token: ${accessToken}`
            );
            const accountResponseData = await Plaid.getAccountData(accessToken);
            console.log('accountResponseData', accountResponseData)
            if (!accountResponseData.success) {
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
                    accounts: accountResponseData.accountResponseData.accounts,
                    numbers: accountResponseData.accountResponseData.numbers.ach
                }
            }
        } catch (error) {
            logger.error(`ERROR: AuthClass-getAccountData - ${error}`);
            throw error;

        }
    }
}