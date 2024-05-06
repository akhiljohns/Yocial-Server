import mongoose, { Schema, model } from "mongoose";

const reportSchema = new Schema({

    reporterId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        require: true
    },

    reporterUsername: {
        type: String,
        require: true
    },

    reportType: {
        type: String,
        require: true
    },

    targetId: {
        type: mongoose.Types.ObjectId,
        require: true
    },

    details: {
        type: String,
        // require: true
    },

    actionTaken: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true,
})


export const Report = model('report', reportSchema);