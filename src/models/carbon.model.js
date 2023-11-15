import mongoose from "mongoose";


const CarbonSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            trim: true
        },
        transactionId: {
            type: String,
            trim: true,
            required: true
        },
        amountInKg: {
            type: String,
            trim: true,
            required: true
        },

        orderNumber: {
            type: String,
            trim: true,
        },
        priceInCentsUSD: {
            type: String,
            trim: true
        },
        certificateUrl: {
            type: String,
            trim: true,
            default: ""
        },
        downloadUrl: {
            type: String,
            trim: true,
            default: ""
        },

    },
    {
        timestamps: true,
        versionKey: false,
        minimize: false
    }
);

const CarbonModel = mongoose.model("Carbon", CarbonSchema);

export default CarbonModel;
