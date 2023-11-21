

import axios from "axios";
import logger from "../lib/logger";
import response from "./response";
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const PLAID_CLIENT_ID = "651f2835e34ad1001c7b0ac9"
const PLAID_SECRET = "26e7649d1eb63bc41304331bca532f"
const PLAID_PRODUCTS = ["auth", "transactions", "identity"]
const PLAID_COUNTRY_CODES = ["US"]
const PLAID_ENV = 'sandbox';

const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': "651f2835e34ad1001c7b0ac9",
            'PLAID-SECRET': "26e7649d1eb63bc41304331bca532f",
        },
    },
});

const plaidClient = new PlaidApi(configuration);

export const createLinkToken = async (userId) => {
    try {
        logger.info(`INFO: Plaid-createLinkToken: ${userId}`);

        const configs = {
            user: {
                // This should correspond to a unique id for the current user.
                client_user_id: userId,
            },
            client_name: 'Plaid Quickstart',
            products: PLAID_PRODUCTS,
            country_codes: PLAID_COUNTRY_CODES,
            language: 'en',
            redirect_uri: "http://localhost:3000"
        };

        const createTokenResponse = await plaidClient.linkTokenCreate(configs);
        logger.debug(`RESULT: Plaid-createLinkToken: STATUS: ${createTokenResponse.status} - DATA: ${JSON.stringify(createTokenResponse.data)}`);
        if (createTokenResponse.status == 200) {
            return { success: true, createTokenResponseData: createTokenResponse.data };
        }

    } catch (error) {
        logger.error(`ERROR: Plaid-createLinkToken: ${error}`);
        throw error;
    }
}

export const exchangePublicToken = async (public_token) => {
    try {
        logger.info(`INFO: Plaid-exchangePublicToken: ${public_token}`);

        const body = { public_token }
        const publicTokenResponse = await plaidClient.itemPublicTokenExchange(body);

        logger.debug(`RESULT: Plaid-exchangePublicToken: STATUS: ${publicTokenResponse.status} - DATA: ${JSON.stringify(publicTokenResponse.data)}`);
        if (publicTokenResponse.status == 200) {
            return { success: true, publicTokenResponseData: publicTokenResponse.data }
        }

    } catch (error) {
        logger.error(`ERROR: Plaid-exchangePublicToken: ${error}`);
        throw error;
    }
}

export const getAccountData = async (access_token) => {
    try {
        logger.info(`INFO: Plaid-getAccountData: ${access_token}`);

        const body = { access_token }
        const accountResponse = await plaidClient.authGet(body);

        logger.debug(`RESULT: Plaid-getAccountData: STATUS: ${accountResponse.status} - DATA: ${JSON.stringify(accountResponse.data)}`);
        if (accountResponse.status == 200) {
            return { success: true, accountResponseData: accountResponse.data };
        }

    } catch (error) {
        logger.error(`ERROR: Plaid-getAccountData: ${error}`);
        throw error;
    }
}

export const getTransactionData = async (access_token) => {
    try {
        logger.info(`INFO: Plaid-getTransactionData: ${access_token}`);

        const body = { access_token }
        const transactionDataResponse = await plaidClient.transactionsSync(body);
        const transactions = transactionDataResponse.data.transactions;
        logger.debug(`RESULT: Plaid-getTransactionData: STATUS: ${transactionDataResponse.status} - DATA: ${JSON.stringify(transactionDataResponse.data)}`);
        if (transactionDataResponse.status == 200) {
            return { success: true, transactionResponseData: transactionDataResponse.data };
        }

    } catch (error) {
        logger.error(`ERROR: Plaid-getTransactionData: ${error}`);
        throw error;
    }
}

export const getRecurringTransactions = async (access_token, accountIds) => {
    try {
        logger.info(`INFO: Plaid-getRecurringTransactions: Access Token: ${access_token} - Account IDs: ${accountIds}`);

        const body = {
            "client_id": PLAID_CLIENT_ID,
            "secret": PLAID_SECRET,
            access_token,
            account_ids: accountIds
        }
        const transactionDataResponse = await plaidClient.transactionsRecurringGet(body);
        console.log('TransactionData', transactionDataResponse);
        // const transactions = transactionDataResponse.data.transactions;
        logger.debug(`RESULT: Plaid-getRecurringTransactions: STATUS: ${transactionDataResponse.status} - DATA: ${JSON.stringify(transactionDataResponse.data)}`);
        if (transactionDataResponse.status == 200) {
            return { success: true, transactionResponseData: transactionDataResponse.data };
        }

    } catch (error) {
        logger.error(`ERROR: Plaid-getRecurringTransactions: ${error}`);
        throw error;
    }
}

export const getIdentityInformation = async (access_token) => {
    try {
        logger.info(`INFO: Plaid-getIdentityInformation: Access Token: ${access_token}`);

        const body = {
            "client_id": PLAID_CLIENT_ID,
            "secret": PLAID_SECRET,
            access_token,
        }
        const userIdentificationResponse = await plaidClient.identityGet(body);
        console.log('userIdentificationResponse', userIdentificationResponse)
        // const userIdentificationData = userIdentificationResponse.data.transactions;
        logger.debug(`RESULT: Plaid-getIdentityInformation: STATUS: ${userIdentificationResponse.status} - DATA: ${JSON.stringify(userIdentificationResponse.data)}`);
        if (userIdentificationResponse.status == 200) {
            return { success: true, userIdentificationResponseData: userIdentificationResponse.data };
        }

    } catch (error) {
        logger.error(`ERROR: Plaid-getIdentityInformation: ${error}`);
        throw error;
    }
}