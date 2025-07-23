import { autoInjectable } from "tsyringe";
import { Request , Response } from "express";
import UserApiServices from "../../services/user-services/fetch-user-api";
import SocketConnection from "../../main/socket";

@autoInjectable()
class UserApiController {
    constructor(private userApiServices: UserApiServices , private socketApi : SocketConnection) { }

    fetchProfileDetails = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const userProfile = await this.userApiServices.getProfileDetails(id);
            res.status(202).json({ message: "User profile sent", userProfile });
            return
        } catch (error: any) {
            res.status(404).json({ error: error.message });
            return 
        }
    };

    fetchOtherProfile = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const userProfile = await this.userApiServices.getOtherProfile(id);
            res.status(202).json({ message: "User profile sent", userProfile });
            return
        } catch (error: any) {
            res.status(404).json({ error: error.message });
            return
        }
    };

    fetchAllAccounts = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const allAccounts = await this.userApiServices.getAllAccounts(email);
            res.status(202).json({ allAccounts });
            return
        } catch (error: any) {
            res.status(400).json({ error: error.message });
            return
        }
    };

    fetchSingleUserProfile = async (req: Request, res: Response) => {
        const query: { username?: string; _id?: string } = {};

        if (req.query.username) query.username = String(req.query.username);
        if (req.params.id) query._id = String(req.params.id);

        const result = await this.userApiServices.fetchSingleUserProfile(query);

        if (result.success) {
            res.status(result.status).json({ userProfile: result.data });
            return 
        }

        res.status(result.status).json({ error: result.message });
        return
    };

    fetchOnlineStatus = async (req : Request , res : Response) => {
         const userId = req.params.id;
         const status = this.socketApi.CheckUserOnlineStatus(userId);
         res.status(status.status).json({ onlineStatus : status.onlineStatus })
         return;

    }
}

export default UserApiController;
