import { injectable } from "tsyringe";
import crypto from "crypto";
import PersonalChatDoc from "../../models/PersonalChatDoc";

@injectable()
class ChatMessageService {
    async savePersonalChat(chatData: any) {
        try {
            const savedChat = await PersonalChatDoc.create(chatData);
            return {
                status: 200,
                success: true,
                message: "Chat saved",
                data: savedChat,
            };
        } catch (error: any) {
            console.error(error);
            return {
                status: 500,
                success: false,
                message: "Error saving chat",
                error: error.message,
            };
        }
    }

    async saveAdditionalData(allData: string, files: Express.Multer.File[]) {
        try {
            const parsedData = JSON.parse(allData);
            const additionalData = files.map((file) => ({
                data: file.buffer,
                contentType: file.mimetype,
            }));

            const dataToSave: any = {
                userId: parsedData.userId,
                otherUserId: parsedData.otherUserId,
                chatId: parsedData.chatId,
                username: parsedData.username,
                initateTime: parsedData.initateTime,
                AdditionalData: additionalData,
            };

            const savedData = await PersonalChatDoc.create(dataToSave);
            if (!savedData) {
                return { status: 404, success: false, message: "Failed to save message" };
            }

            return { status: 200, success: true, message: "Message has been saved" };
        } catch (error: any) {
            return {
                status: 500,
                success: false,
                message: "Server internal error",
                error: error.message,
            };
        }
    }

    async saveAudioMessage(audioData: string, audioFile?: Express.Multer.File) {
        if (!audioFile) {
            return { status: 404, success: false, message: "Audio file missing" };
        }

        try {
            const parsedData = JSON.parse(audioData);

            const fileData = {
                data: audioFile.buffer,
                contentType: "wav",
            };

            const dataToSave: any = {
                userId: parsedData.userId,
                otherUserId: parsedData.otherUserId,
                chatId: parsedData.chatId,
                username: parsedData.username,
                initateTime: parsedData.initateTime,
                AdditionalData: [fileData],
            };

            const savedData = await PersonalChatDoc.create(dataToSave);
            if (!savedData) {
                return { status: 404, success: false, message: "Failed to save message" };
            }

            return { status: 200, success: true, message: "Audio message saved" };
        } catch (error: any) {
            return {
                status: 500,
                success: false,
                message: "Server internal error",
                error: error.message,
            };
        }
    }

    generateChatId(mixedId: string): string {
        return crypto.createHmac("sha256", process.env.CHAT_KEY as string).update(mixedId).digest("hex");
    }
}

export default ChatMessageService;
