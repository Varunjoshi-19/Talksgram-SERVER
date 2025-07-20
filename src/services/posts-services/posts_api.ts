import { autoInjectable } from "tsyringe";
import CommentDoc from "../../models/Comments";
import PostDoc from "../../models/PostDoc";
import LikedPostDoc from "../../models/LikedPost";
import AllHelpServices from "../../utils/index";

@autoInjectable()
class PostsApiServices {

    constructor(private allHelp: AllHelpServices) { }

    async fetchAllComments(postId: string) {
        try {
            const comments = await CommentDoc.find({ postId }).sort({ createdAt: -1 });
            if (!comments || comments.length === 0) {
                return { status: 404, success: false, message: "No comment yet" };
            }
            return { status: 202, success: true, data: comments };
        } catch (error: any) {
            return { status: 505, success: false, message: error.message };
        }
    }

    async fetchPosts(skip: number) {
        try {
            const posts = await PostDoc.find({}).sort({ createdAt: 1 }).skip(skip).limit(5);
            if (!posts || posts.length === 0) {
                return { status: 201, success: false, message: "Empty" };
            }

            const shuffledPosts = this.allHelp.shufflePosts(posts);
            return { status: 202, success: true, data: shuffledPosts };
        } catch (error: any) {
            return { status: 505, success: false, message: error.message };
        }
    }

    async fetchLikedPost(postId: string, userId: string) {
        try {
            const likedPost = await LikedPostDoc.find({
                $and: [{ postId }, { userId }]
            });

            return {
                status: 200,
                success: true,
                likeStatus: likedPost && likedPost.length > 0
            };
        } catch (error: any) {
            return { status: 505, success: false, message: error.message };
        }
    }

    async fetchAllPosts(userId: string) {
        try {
            const allPosts = await PostDoc.find({ "author.userId": userId });
            return { status: 202, success: true, data: allPosts };
        } catch (error: any) {
            return { status: 505, success: false, message: error.message };
        }
    }

    async handlefetchUserPost(id: string) {

        try {
            if (!id) {
                return { status: 404, message: "post id missing!" };
            }

            const post = await PostDoc.findOne({ _id: id }, {"author.userId" : 1, "author.userAccId" : 1 , postLike : 1, createdAt : 1});
            if (!post) {
                return { status: 404, message: "post not available" }
            }

            return { status: 200, post: post };
        } catch (error) {
            return { status: 505, message: error };
        }
    }
}

export default PostsApiServices;
