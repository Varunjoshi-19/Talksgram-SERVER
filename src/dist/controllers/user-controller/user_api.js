"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const fetch_user_api_1 = __importDefault(require("../../services/user-services/fetch-user-api"));
const socket_1 = __importDefault(require("../../main/socket"));
let UserApiController = class UserApiController {
    constructor(userApiServices, socketApi) {
        this.userApiServices = userApiServices;
        this.socketApi = socketApi;
        this.fetchProfileDetails = async (req, res) => {
            try {
                const id = req.params.id;
                const userProfile = await this.userApiServices.getProfileDetails(id);
                res.status(202).json({ message: "User profile sent", userProfile });
                return;
            }
            catch (error) {
                res.status(404).json({ error: error.message });
                return;
            }
        };
        this.fetchOtherProfile = async (req, res) => {
            try {
                const id = req.params.id;
                const userProfile = await this.userApiServices.getOtherProfile(id);
                res.status(202).json({ message: "User profile sent", userProfile });
                return;
            }
            catch (error) {
                res.status(404).json({ error: error.message });
                return;
            }
        };
        this.fetchAllAccounts = async (req, res) => {
            try {
                const { email } = req.body;
                const allAccounts = await this.userApiServices.getAllAccounts(email);
                res.status(202).json({ allAccounts });
                return;
            }
            catch (error) {
                res.status(400).json({ error: error.message });
                return;
            }
        };
        this.fetchSingleUserProfile = async (req, res) => {
            const query = {};
            if (req.query.username)
                query.username = String(req.query.username);
            if (req.params.id)
                query._id = String(req.params.id);
            const result = await this.userApiServices.fetchSingleUserProfile(query);
            if (result.success) {
                res.status(result.status).json({ userProfile: result.data });
                return;
            }
            res.status(result.status).json({ error: result.message });
            return;
        };
        this.fetchOnlineStatus = async (req, res) => {
            const userId = req.params.id;
            const status = this.socketApi.CheckUserOnlineStatus(userId);
            console.log(status);
            res.status(status.status).json({ onlineStatus: status.onlineStatus });
            return;
        };
    }
};
UserApiController = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [fetch_user_api_1.default, socket_1.default])
], UserApiController);
exports.default = UserApiController;
