"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProfileDoc_1 = __importDefault(require("../../models/ProfileDoc"));
class UserApiServices {
    async getProfileDetails(userAccId) {
        const userProfile = await ProfileDoc_1.default.findOne({ userAccId });
        if (!userProfile)
            throw new Error("Profile not found");
        return userProfile;
    }
    async getOtherProfile(id) {
        const userProfile = await ProfileDoc_1.default.findOne({ _id: id });
        if (!userProfile)
            throw new Error("Profile not found");
        return userProfile;
    }
    async getAllAccounts(excludeEmail) {
        if (!excludeEmail)
            throw new Error("Email is required");
        const allAccounts = await ProfileDoc_1.default.find({ email: { $ne: excludeEmail } }).limit(4);
        return allAccounts;
    }
    async fetchSingleUserProfile(query) {
        if (!query.username && !query._id) {
            return { success: false, status: 404, message: "Either username or id is required" };
        }
        try {
            const userProfile = await ProfileDoc_1.default.findOne(query);
            if (!userProfile) {
                return { success: false, status: 404, message: "No user profile found" };
            }
            return { success: true, status: 202, data: userProfile };
        }
        catch (error) {
            return { success: false, status: 505, message: error.message };
        }
    }
}
exports.default = UserApiServices;
