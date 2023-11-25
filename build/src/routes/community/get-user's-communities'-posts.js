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
exports.getUserCommunityFeedRouter = void 0;
const Community_1 = require("./../../models/Community");
const common_1 = require("@devion/common");
const currentuser_1 = require("../../middlewares/currentuser");
const express_1 = __importDefault(require("express"));
const Post_1 = require("../../models/Post");
const User_1 = require("../../models/User");
const router = express_1.default.Router();
exports.getUserCommunityFeedRouter = router;
router.get("/api/community/user/feed", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit = 20, skip = 0 } = req.query;
        const existingUser = yield User_1.User.findOne({ _id: req.foxxiUser.id });
        if (!existingUser) {
            throw new common_1.BadRequestError("User not found!");
        }
        //find all communities that the user is a member of
        const userCommunities = yield Community_1.Community.find({
            members: { $elemMatch: { userId: existingUser } },
        });
        const userCommunityFeed = yield Post_1.Post.find({
            communityId: { $in: userCommunities },
        })
            .populate("author")
            .skip(Number(skip))
            .limit(Number(limit))
            .sort({ createdAt: -1 });
        const { name } = req.params; //name of community
        const totalCommunityPosts = yield Post_1.Post.find({
            communityId: { $in: userCommunities },
        }).countDocuments();
        res.status(200).send({
            message: "Community posts",
            userCommunityFeed,
            totalCommunityPosts,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: err });
    }
}));
