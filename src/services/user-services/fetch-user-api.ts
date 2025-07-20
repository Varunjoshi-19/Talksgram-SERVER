import ProfileDoc from "../../models/ProfileDoc";


class UserApiServices {


    async getProfileDetails(userAccId: string) {
        const userProfile = await ProfileDoc.findOne({userAccId });
        if (!userProfile) throw new Error("Profile not found");
        return userProfile;
    }

    async getOtherProfile(id: string) {
        const userProfile = await ProfileDoc.findOne({ _id: id });
        if (!userProfile) throw new Error("Profile not found");
        return userProfile;
    }

    async getAllAccounts(excludeEmail: string) {
        if (!excludeEmail) throw new Error("Email is required");
        const allAccounts = await ProfileDoc.find({ email: { $ne: excludeEmail } }).limit(4);
        return allAccounts;
    }

    async fetchSingleUserProfile(query: { username?: string; _id?: string }) {
        if (!query.username && !query._id) {
            return { success: false, status: 404, message: "Either username or id is required" };
        }

        try {
            const userProfile = await ProfileDoc.findOne(query);

            if (!userProfile) {
                return { success: false, status: 404, message: "No user profile found" };
            }

            return { success: true, status: 202, data: userProfile };
        } catch (error: any) {
            return { success: false, status: 505, message: error.message };
        }
    }


}




export default UserApiServices;