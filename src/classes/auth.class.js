import asyncRedis from "async-redis";

import { redisConfig } from "../config";
import BaseClass from "./base.class.js";

import logger from "../lib/logger";

import * as authUtils from "../lib/auth";
import response from "../lib/response.js";

console.log('REDIS CONFIG', redisConfig.host);
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
            let user = await redisClient.get(email);

            let isExistingUser = user ? true : false;

            if (isExistingUser) {
                user = JSON.parse(user);
                return {
                    ...response.AUTH.GENERATE_OTP.EXISTING_USER.SUCCESS,
                    results: { ...user }
                };

            }
            const data = await authUtils.generateEmailVerificationToken(email, isLogin)
            logger.debug(`RESULT: AuthClass-sendTokenForEmailVerification: ${JSON.stringify(data)}`)

            const { isLogin, resendEmailTokenCount, wrongEmailTokenCount, deviceToken, expiryTime } = data;

            return {
                ...response.AUTH.GENERATE_OTP.EXISTING_USER.SUCCESS,
                results: { isLogin, resendEmailTokenCount, wrongEmailTokenCount, deviceToken, expiryTime }
            };
        } catch (error) {
            logger.error(`ERROR: AuthClass-sendTokenForEmailVerification - ${error}`);
            throw error;

        }
    }

    async verifyEmailVerificationToken(email, deviceToken, verificationCode, isLogin = false) {
        try {
            logger.info(
                `INFO: AuthClass-verifyEmailVerificationToken - Email: ${email}`
            );
            const isExistingUser = await redisClient.get(email);

            const isLogin = isExistingUser ? true : false;


            const data = await authUtils.isValidEmailToken(email, deviceToken, verificationCode);
            logger.debug(`RESULT: AuthClass-verifyEmailVerificationToken: ${JSON.stringify(data)}`)
            const { isValid, tokenDetails } = data;

            console.log("ISVALUD OUTSIDE", isValid)

            if (!isValid) {
                console.log("ISVALUD", isValid)
                return {
                    ...response.AUTH.VERIFY_OTP.FAILURE,
                    messageObj: {
                        wrongEmailTokenCount: tokenDetails.wrongEmailTokenCount,
                        resendEmailTokenCount: tokenDetails.resendEmailTokenCount,
                    }
                }
            }

            return {
                ...response.AUTH.VERIFY_OTP.SUCCESS,
                results: {
                    isLogin: true,
                    wrongEmailTokenCount: tokenDetails.wrongEmailTokenCount,
                    resendEmailTokenCount: tokenDetails.resendEmailTokenCount
                }
            }
        } catch (error) {
            logger.error(`ERROR: AuthClass-verifyEmailVerificationToken - ${error}`);
            throw error;

        }
    }

    async createNewAccountForUser(email, deviceToken, firstName, lastName, referralCode = "false") {
        try {
            logger.info(
                `INFO: AuthClass-verifyEmailVerificationToken - Email: ${email}`
            );
            const isExistingUser = await redisClient.get(email);

            const isLogin = isExistingUser ? true : false;


            const { canUserCreateNewAccount } = await authUtils.canUserCreateANewAccount(email, deviceToken);
            logger.debug(`RESULT: AuthClass-verifyEmailVerificationToken: ${canUserCreateNewAccount}`)

            if (!canUserCreateNewAccount) {
                return {
                    ...response.AUTH.CREATE_NEW_USER.SUCCESS,
                    messageObj: {
                        error: "Please go back and start the process"
                    }
                }
            }

            const userData = {
                firstName,
                lastName,
                email
            }

            await redisClient.set(email, JSON.stringify(userData));

            return {
                ...response.AUTH.CREATE_NEW_USER.SUCCESS,
                results: userData
            }
        } catch (error) {
            logger.error(`ERROR: AuthClass-verifyEmailVerificationToken - ${error}`);
            throw error;

        }
    }
}