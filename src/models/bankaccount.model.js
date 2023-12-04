import mongoose from "mongoose";


const BankAccountSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            trim: true
        },
        name: {
            type: String,
            trim: true,
            required: true
        },
        email: {
            type: String,
            trim: true
        },

        phoneNumber: {
            type: String,
            trim: true,
        },
        priceInCentsUSD: {
            type: String,
            trim: true
        },
        address: {
            street: {
                type: String,
                trim: true,
            },
            city: {
                type: String,
                trim: true,
            },
            region: {
                type: String,
                trim: true,
            },
            country: {
                type: String,
                trim: true,
            },
            postal_code: {
                type: String,
                trim: true,
            }
        },
        accountId: {
            type: String,
            trim: true,
            required: true
        },
        accountNumber: {
            type: String,
            trim: true,
            required: true
        },
        routingNumber: {
            type: String,
            trim: true,
        },
        wireRoutingNumber: {
            type: String,
            trim: true,
        },
        accountName: {
            type: String,
            trim: true,
        },
        officialAccountName: {
            type: String,
            trim: true,
        },
        accountType: {
            type: String,
            trim: true,
        },
        accountSubType: {
            type: String,
            trim: true,
        },
        currentBalance: {
            type: Number,
            trim: true,
        },
        availableBalance: {
            type: Number,
            trim: true,
        },
        accountSubType: {
            type: String,
            trim: true,
        },


    },
    {
        timestamps: true,
        versionKey: false,
        minimize: false
    }
);

const BankAccountModel = mongoose.model("BankAccount", BankAccountSchema);

export default BankAccountModel;
