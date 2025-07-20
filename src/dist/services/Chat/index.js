"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const crypto_1 = __importDefault(require("crypto"));
const PersonalChatDoc_1 = __importDefault(require("../../models/PersonalChatDoc"));
let ChatMessageService = class ChatMessageService {
    async savePersonalChat(chatData) {
        try {
            const savedChat = await PersonalChatDoc_1.default.create(chatData);
            return {
                status: 200,
                success: true,
                message: "Chat saved",
                data: savedChat,
            };
        }
        catch (error) {
            console.error(error);
            return {
                status: 500,
                success: false,
                message: "Error saving chat",
                error: error.message,
            };
        }
    }
    async saveAdditionalData(allData, files) {
        try {
            const parsedData = JSON.parse(allData);
            const additionalData = files.map((file) => ({
                data: file.buffer,
                contentType: file.mimetype,
            }));
            const dataToSave = {
                userId: parsedData.userId,
                otherUserId: parsedData.otherUserId,
                chatId: parsedData.chatId,
                username: parsedData.username,
                initateTime: parsedData.initateTime,
                AdditionalData: additionalData,
            };
            const savedData = await PersonalChatDoc_1.default.create(dataToSave);
            if (!savedData) {
                return { status: 404, success: false, message: "Failed to save message" };
            }
            return { status: 200, success: true, message: "Message has been saved" };
        }
        catch (error) {
            return {
                status: 500,
                success: false,
                message: "Server internal error",
                error: error.message,
            };
        }
    }
    async saveAudioMessage(audioData, audioFile) {
        if (!audioFile) {
            return { status: 404, success: false, message: "Audio file missing" };
        }
        try {
            const parsedData = JSON.parse(audioData);
            const fileData = {
                data: audioFile.buffer,
                contentType: "wav",
            };
            const dataToSave = {
                userId: parsedData.userId,
                otherUserId: parsedData.otherUserId,
                chatId: parsedData.chatId,
                username: parsedData.username,
                initateTime: parsedData.initateTime,
                AdditionalData: [fileData],
            };
            const savedData = await PersonalChatDoc_1.default.create(dataToSave);
            if (!savedData) {
                return { status: 404, success: false, message: "Failed to save message" };
            }
            return { status: 200, success: true, message: "Audio message saved" };
        }
        catch (error) {
            return {
                status: 500,
                success: false,
                message: "Server internal error",
                error: error.message,
            };
        }
    }
    generateChatId(mixedId) {
        return crypto_1.default.createHmac("sha256", process.env.CHAT_KEY).update(mixedId).digest("hex");
    }
};
ChatMessageService = __decorate([
    (0, tsyringe_1.injectable)()
], ChatMessageService);
exports.default = ChatMessageService;
