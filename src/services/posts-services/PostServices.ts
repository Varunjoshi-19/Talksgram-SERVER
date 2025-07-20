import { autoInjectable } from "tsyringe";
import PostDoc from "../../models/PostDoc";
import LikedPostDoc from "../../models/LikedPost";
import ProfileDoc from "../../models/ProfileDoc";
import CommentDoc from "../../models/Comments";
import PersonalChatDoc from "../../models/PersonalChatDoc";

@autoInjectable()
class PostServices {

    async handleNewPostUpload(profile: string, caption: string, postImage: Express.Multer.File) {
        if (!postImage || !profile) {
            return { status: 404, success: false, message: "Failed to post" };
        }

        const parsedProfile = JSON.parse(profile);

        const newPostInfo: any = {
            postImage: {
                data: postImage.buffer,
                contentType: postImage.mimetype
            },
            author: {
                userId: parsedProfile._id,
                userAccId: parsedProfile.userAccId
            }
        };

        if (caption !== "") newPostInfo.postDescription = caption;

        try {
            const newPost = await PostDoc.create(newPostInfo);
            if (!newPost) return { status: 404, success: false, message: "Failed to upload post" };

            await ProfileDoc.findOneAndUpdate(
                { _id: parsedProfile._id },
                { $inc: { post: 1 } },
                { new: true }
            );

            return { status: 200, success: true, message: "Successfully uploaded" };
        } catch (error: any) {
            return { status: 505, success: false, message: error.message };
        }
    }

    async handleAddLikePost(postId: string, userId: string) {
        if (!postId || !userId) return { status: 404, success: false, message: "IDs required" };

        const query = { postId, userId };

        try {
            const newLikePost = await LikedPostDoc.create(query);
            if (!newLikePost) return { status: 404, success: false, message: "Failed to like post" };

            await PostDoc.findOneAndUpdate({ _id: postId }, { $inc: { postLike: 1 } }, { new: true });

            return { status: 200, success: true };
        } catch (error: any) {
            return { status: 505, success: false, message: error.message };
        }
    }

    async handleRemoveLikePost(postId: string, userId: string) {
        if (!postId || !userId) return { status: 404, success: false, message: "IDs required" };

        const query = { postId, userId };

        try {
            const removedLikePost = await LikedPostDoc.findOneAndDelete(query);
            if (!removedLikePost) return { status: 404, success: false, message: "Failed to remove like" };

            await PostDoc.findOneAndUpdate({ _id: postId }, { $inc: { postLike: -1 } }, { new: true });

            return { status: 200, success: true };
        } catch (error: any) {
            return { status: 505, success: false, message: error.message };
        }
    }

    async handlePostComment(postId: string, userId: string, commentText: string) {
        const query = {
            postId,
            userId,
            comment: commentText,
            initiateTime: Date.now()
        };

        try {
            const comment = await CommentDoc.create(query);
            if (!comment) return { status: 404, success: false, message: "Failed to post comment" };

            await PostDoc.findByIdAndUpdate(postId, { $inc: { postComment: 1 } }, { new: true });

            return { status: 202, success: true, message: "Comment posted", data: comment };
        } catch (error: any) {
            return { status: 505, success: false, message: error.message };
        }
    }

    async SharedPost(data: any, refId: string) {

        try {
            const { userId, username, initateTime, otherUserId, chatId, sharedContent } = data;

            if (!refId) {
                return { message: "post refId required to share", status: 404 };
            }

            if (!userId || !otherUserId || !chatId) {
                return { message: "some id's are missing ", status: 404 };
            }
            if (!sharedContent) {
                return { message: "share content is required! no data avaliable", status: 404 }
            }

            const storeMessage = {
                chatId,
                userId,
                otherUserId,
                username,
                initateTime,
                sharedContent
            }

            console.log("this is post that you are going to share ", storeMessage);

            const sharedPost = await PersonalChatDoc.create(storeMessage);
            if (!sharedPost) {
                return { message: "failed to share this post", status: 404 };
            }

            return {message : "successfully shared this post" , status : 200};
        }
        catch (error) {
            return { message: error, status: 505 };
        }
    }
}

export default PostServices;
