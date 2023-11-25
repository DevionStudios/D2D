"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommunityUserPostsRouter = void 0;
const express_1 = __importDefault(require("express"));
const common_1 = require("@devion/common");
const User_1 = require("../../models/User");
const Community_1 = require("../../models/Community");
const Post_1 = require("../../models/Post");
const router = express_1.default.Router();
exports.getCommunityUserPostsRouter = router;
router.get("/api/community/posts/:name/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit = 20, skip = 0 } = req.query;
        const { username, name } = req.params; //name=name of community
        const community = yield Community_1.Community.findOne({ name });
        if (!community) {
            throw new common_1.BadRequestError("Community not found, invalid name provided!");
        }
        const existingUser = yield User_1.User.findOne({
            username: username,
        });
        if (!existingUser) {
            throw new common_1.BadRequestError("User not found!");
        }
        const userCommPosts = yield Post_1.Post.find({
            communityId: community,
            author: existingUser,
        })
            .sort({ createdAt: -1 })
            .skip(Number(skip))
            .limit(Number(limit));
        const totalPosts = yield Post_1.Post.find({
            communityId: community,
            author: existingUser,
        }).countDocuments();
        res.status(200).send({
            userPosts: userCommPosts,
            message: "User's posts in the community",
            userCommPosts,
            totalPosts,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: err });
    }
}));
