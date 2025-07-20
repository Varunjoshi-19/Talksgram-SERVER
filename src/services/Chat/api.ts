import { injectable } from "tsyringe";
import PersonalChatDoc from "../../models/PersonalChatDoc";

@injectable()
class ChatApiServices {


    async fetchAllPersonalChats(chatId: string, chatSkip: number) {
        try {
            const limit = 10;
            let chats = await PersonalChatDoc.find({ chatId })
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
        } catch (error: any) {
            return {
                status: 500,
                success: false,
                message: "Error fetching chats",
                error: error.message,
            };
        }
    }

    async fetchChattedUsers(userId: string) {
        try {
            const users = await PersonalChatDoc.find({ otherUserId: userId }).sort({
                initateTime: -1,
            });

            const uniqueUsers: any[] = [];
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
        } catch (error: any) {
            return {
                status: 500,
                success: false,
                message: "Error fetching users",
                error: error.message,
            };
        }
    }
}

export default ChatApiServices;
