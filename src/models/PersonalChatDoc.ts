import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({


    chatId: {
        type: String,
        required: true
    },

    userId: {
        type: String,
        required: true,
    },

    otherUserId: {
        type: String,
        required: true
    },

    username: {

        type: String,
        required: true

    },

    initateTime: {
        type: String,
        required: true
    },

    chat: {
        type: String,
    },

    AdditionalData: [{
        data: Buffer,
        contentType: String
    }],

    sharedContent: {
        type: {
            type: String,
            enum: ["post", "reel"]
        },
        postOwnerId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        postOwnerName: String,
        refId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        previewText: String,
        previewImage: String
    }

}, { timestamps: true });


export default mongoose.model("Messages", MessageSchema);