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
const PersonalChatDoc_1 = __importDefault(require("../../models/PersonalChatDoc"));
let ChatApiServices = class ChatApiServices {
    async fetchAllPersonalChats(chatId, chatSkip) {
        try {
            const limit = 10;
            let chats = await PersonalChatDoc_1.default.find({ chatId })
                .sort({ initateTime: -1 })
                .skip(chatSkip)
                .limit(limit)
                .lean();
            chats = chats.reverse();
            if (!chats || chats.length === 0) {
                return {
                    status: 202,
                    success: false,
                    message: "No messages available",
                };
            }
            return {
                status: 200,
                success: true,
                data: chats,
            };
        }
        catch (error) {
            return {
                status: 500,
                success: false,
                message: "Error fetching chats",
                error: error.message,
            };
        }
    }
    async fetchChattedUsers(userId) {
        try {
            const users = await PersonalChatDoc_1.default.find({ otherUserId: userId }).sort({
                initateTime: -1,
            });
            const uniqueUsers = [];
            const usernames = new Set();
            users.forEach((user) => {
                if (!usernames.has(user.username)) {
                    usernames.add(user.username);
                    uniqueUsers.push(user);
                }
            });
            return {
                status: 202,
                success: true,
                data: uniqueUsers,
            };
        }
        catch (error) {
            return {
                status: 500,
                success: false,
                message: "Error fetching users",
                error: error.message,
            };
        }
    }
};
ChatApiServices = __decorate([
    (0, tsyringe_1.injectable)()
], ChatApiServices);
exports.default = ChatApiServices;
