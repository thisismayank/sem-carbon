import asyncRedis from "async-redis";

import _ from "underscore";

import { redisConfig } from "../config";
import BaseClass from "./base.class.js";

import logger from "../lib/logger";
import response from "../lib/response.js";
import * as Plaid from "../lib/plaid.js"
import * as CNaught from "../lib/cnaught";
import CarbonModel from "../models/carbon.model.js";
import BankAccountModel from "../models/bankaccount.model.js";
const redisClient = asyncRedis.createClient(redisConfig.port, redisConfig.host);

export default class PlaidClass extends BaseClass {

    constructor(connection, redis) {
        super(BankAccountModel.collection.name, connection, redis);
        this.schema = BankAccountModel.schema;
        this.name = BankAccountModel.collection.name;
        this.model = BankAccountModel;
    }

    async createLinkToken(userId) {
        try {
            logger.info(
                `INFO: PlaidClass-createLinkToken - User ID: ${userId}`
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
            logger.error(`ERROR: PlaidClass-createLinkToken - ${error}`);
            throw error;

        }
    }
    async exchangePublicToken(userId, publicToken) {
        try {
            logger.info(
                `INFO: PlaidClass-exchangePublicToken - User ID: ${userId} - Public Token: ${publicToken}`
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
            logger.error(`ERROR: PlaidClass-exchangePublicToken - ${error}`);
            throw error;

        }
    }

    async getAccountData(userId, accessToken) {
        try {
            logger.info(
                `INFO: PlaidClass-getAccountData - User ID: ${userId} - Access Token: ${accessToken}`
            );

            const accountResponseData = await Plaid.getAccountData(accessToken);
            console.log('accountResponseData', accountResponseData)

            const databaseEntryData = {
                accountId: accountResponseData.accountResponseData.accounts[0].account_id,
                currentBalance: accountResponseData.accountResponseData.accounts[0].balances.current,
                availableBalance: accountResponseData.accountResponseData.accounts[0].balances.available,

                accountNumber: accountResponseData.accountResponseData.numbers.ach[0].account,
                routingNumber: accountResponseData.accountResponseData.numbers.ach[0].routing,
                wireRoutingNumber: accountResponseData.accountResponseData.numbers.ach[0].wire_routing,
            }

            await this.model.create()
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
            logger.error(`ERROR: PlaidClass-getAccountData - ${error}`);
            throw error;

        }
    }

    async getTransactionData(userId, accessToken) {
        try {
            logger.info(
                `INFO: PlaidClass-getTransactionData - User ID: ${userId} - Access Token: ${accessToken}`
            );
            const transactionData = await Plaid.getTransactionData(accessToken);
            console.log('transactionData', transactionData)
            if (!transactionData.success) {
                return {
                    ...response.CARBON.CNAUGHT.PLACE_ORDER.FAILURE,
                    messageObj: {
                        error: "Some error occured in order placement"
                    }
                }
            }
            let co2mapping = {
                m: {
                    price: 6.5,
                    carbon: 3.5
                },
                air: {
                    carbon: 7
                },
                fun: {
                    carbon: 1,
                    price: 40
                },
                uber: {
                    price: 1.5,
                    carbon: 0.3
                },
                starbucks: {
                    price: 3,
                    carbon: 3.6
                }
            }

            let totalCarbonEmissions = 0;
            for (let transaction of transactionData.transactionResponseData.added) {
                let totalCarbon = 0;
                const randomAddition = Math.random(0, 10) * 10
                if (randomAddition > 5) {
                    transaction.amount = transaction.amount + randomAddition
                } else {
                    transaction.amount = transaction.amount - randomAddition

                }

                if (transaction.amount.toString().charAt(0) !== "-") {
                    if (transaction.name.toLowerCase().includes("mcdonald")) {
                        totalCarbon = co2mapping.m.carbon * (transaction.amount / co2mapping.m.price)
                    } else if (transaction.name.toLowerCase().includes("airline")) {
                        totalCarbon = co2mapping.air.carbon * (transaction.amount)
                    } else if (transaction.name.toLowerCase().includes("uber")) {
                        totalCarbon = co2mapping.uber.carbon * (transaction.amount / co2mapping.uber.price)
                    } else if (transaction.name.toLowerCase().includes("star")) {
                        totalCarbon = co2mapping.starbucks.carbon * (transaction.amount / co2mapping.starbucks.price)
                    } else {
                        totalCarbon = co2mapping.fun.carbon * (transaction.amount / co2mapping.fun.price)
                    }
                }
                transaction['carbon'] = totalCarbon;

                totalCarbonEmissions = totalCarbon + totalCarbonEmissions
            }



            return {
                ...response.CARBON.CNAUGHT.PLACE_ORDER.SUCCESS,
                results: {
                    added: transactionData.transactionResponseData.added,
                    has_more: transactionData.transactionResponseData.has_more,
                    next_cursor: transactionData.transactionResponseData.next_cursor,
                    totalCarbonEmissions: totalCarbonEmissions.toFixed(2)

                }
            }
        } catch (error) {
            logger.error(`ERROR: PlaidClass-getTransactionData - ${error}`);
            throw error;

        }
    }

    async getRecurringTransactions(userId, accessToken) {
        try {
            logger.info(
                `INFO: PlaidClass-getRecurringTransactions - User ID: ${userId} - Access Token: ${accessToken}`
            );

            const accountIds = ["jv7xArkxkRiAKLN5zqQxiZN4GMvXb9c6kJjKE"];
            const recurringTransactionsData = await Plaid.getRecurringTransactions(accessToken, accountIds);
            console.log('recurringTransactionsData', recurringTransactionsData)
            if (!recurringTransactionsData.success) {
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
                    deposits: recurringTransactionsData.transactionResponseData.inflow_streams,
                    expenses: recurringTransactionsData.transactionResponseData.outflow_streams,
                    lastUpdatedAt: recurringTransactionsData.transactionResponseData.updated_datetime,

                }
            }
        } catch (error) {
            logger.error(`ERROR: PlaidClass-getRecurringTransactions - ${error}`);
            throw error;

        }
    }

    async getIdentityInformation(userId, accessToken) {
        try {
            logger.info(
                `INFO: PlaidClass-getIdentityInformation - User ID: ${userId} - Access Token: ${accessToken}`
            );
            const userIdentificationData = await Plaid.getIdentityInformation(accessToken);
            console.log('userIdentificationData', JSON.stringify(userIdentificationData, null, 2))
            if (!userIdentificationData.success) {
                return {
                    ...response.CARBON.CNAUGHT.PLACE_ORDER.FAILURE,
                    messageObj: {
                        error: "Some error occured in order placement"
                    }
                }
            }
            const responseData = {
                name: userIdentificationData.userIdentificationResponseData.accounts[0].owners[0].names[0],
                email: userIdentificationData.userIdentificationResponseData.accounts[0].owners[0].emails.filter(email => { if (email.primary) { return email.data } })[0].data,
                phoneNumber: userIdentificationData.userIdentificationResponseData.accounts[0].owners[0].phone_numbers.filter(phoneNumber => { if (phoneNumber.type === "mobile") { return phoneNumber.data } })[0].data,
                address: userIdentificationData.userIdentificationResponseData.accounts[0].owners[0].addresses.filter(address => { if (address.primary) { return address.data } })[0].data,
                mask: userIdentificationData.userIdentificationResponseData.accounts[0].mask,
                accountNameAlias: userIdentificationData.userIdentificationResponseData.accounts[0].name,
                names: userIdentificationData.userIdentificationResponseData.accounts[0].owners[0].names,
                officialAccountName: userIdentificationData.userIdentificationResponseData.accounts[0].official_name,
                addresses: userIdentificationData.userIdentificationResponseData.accounts[0].owners[0].addresses,
                emails: userIdentificationData.userIdentificationResponseData.accounts[0].owners[0].emails,
                phoneNumbers: userIdentificationData.userIdentificationResponseData.accounts[0].owners[0].phone_numbers,
            }
            return {
                ...response.CARBON.CNAUGHT.PLACE_ORDER.SUCCESS,
                results: {
                    ...responseData
                }
            }
        } catch (error) {
            logger.error(`ERROR: PlaidClass-getIdentityInformation - ${error}`);
            throw error;

        }
    }
}