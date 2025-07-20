"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    postImage: {
        data: Buffer,
        contentType: String
    },
    postLike: {
        type: Number,
        default: 0
    },
    postComment: {
        type: Number,
        default: 0
    },
    postDescription: {
        type: String,
        default: ""
    },
    author: {
        userId: {
            type: String,
            required: true,
        },
        userAccId: {
            type: String,
            required: true
        }
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model("Posts", PostSchema);
