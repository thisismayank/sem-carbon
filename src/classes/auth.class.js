import asyncRedis from "async-redis";

import { redisConfig } from "../config";
import BaseClass from "./base.class.js";

import logger from "../lib/logger";

import * as authUtils from "../lib/auth";
import { generateToken } from "../lib/token";

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

            const isExistingUser = user ? true : false;


            const data = await authUtils.generateEmailVerificationToken(email, isExistingUser)
            logger.debug(`RESULT: AuthClass-sendTokenForEmailVerification: ${JSON.stringify(data)}`)

            const { isLogin, resendEmailTokenCount, wrongEmailTokenCount, deviceToken, expiryTime } = data;

            return {
                ...response.AUTH.GENERATE_OTP.SEND_GENERATED_OTP.SUCCESS,
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
            let user = await redisClient.get(email);

            const isExistingUser = user ? true : false;


            const data = await authUtils.isValidEmailToken(email, deviceToken, verificationCode);
            logger.debug(`RESULT: AuthClass-verifyEmailVerificationToken: ${JSON.stringify(data)}`)
            const { isValid, tokenDetails, tokenExpired } = data;


            if (!isValid) {
                return {
                    ...response.AUTH.VERIFY_OTP.FAILURE,
                    messageObj: {
                        wrongEmailTokenCount: tokenDetails.wrongEmailTokenCount || 1,
                        resendEmailTokenCount: tokenDetails.resendEmailTokenCount || 1,
                        deviceTokenExpired: tokenExpired || false
                    }
                }
            }

            if (isExistingUser) {
                user = JSON.parse(user);
                const { userId } = user;
                const token = await generateToken(userId);

                return {
                    ...response.AUTH.VERIFY_OTP.LOG_IN,
                    results: { ...user, token }
                }
            }

            return {
                ...response.AUTH.VERIFY_OTP.SUCCESS,
                results: {
                    isLogin: false,
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
                `INFO: AuthClass-createNewAccountForUser - Email: ${email}`
            );
            const isExistingUser = await redisClient.get(email);

            const isLogin = isExistingUser ? true : false;


            const { canUserCreateNewAccount } = await authUtils.canUserCreateANewAccount(email, deviceToken);
            logger.debug(`RESULT: AuthClass-createNewAccountForUser: CanUserCreateNewAccount: ${canUserCreateNewAccount}`)

            if (!canUserCreateNewAccount) {
                return {
                    ...response.AUTH.CREATE_NEW_USER.FAILURE,
                    messageObj: {
                        error: "Please go back and start the process"
                    }
                }
            }

            const userId = `${email}_${new Date().getTime()}`

            const token = await generateToken(userId);


            const userData = {
                firstName,
                lastName,
                email,
                userId
            }

            await redisClient.set(email, JSON.stringify(userData));

            return {
                ...response.AUTH.CREATE_NEW_USER.SUCCESS,
                results: { ...userData, token }
            }
        } catch (error) {
            logger.error(`ERROR: AuthClass-createNewAccountForUser - ${error}`);
            throw error;

        }
    }


}