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
exports.getCommunityPostsRouter = void 0;
const Community_1 = require("./../../models/Community");
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const Post_1 = require("../../models/Post");
const router = express_1.default.Router();
exports.getCommunityPostsRouter = router;
router.get("/api/community/posts/:name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.params; //name of community
        const { limit = 20, skip = 0 } = req.query;
        const community = yield Community_1.Community.findOne({ name });
        if (!community) {
            throw new common_1.BadRequestError("Community not found, invalid name provided!");
        }
        const communityPosts = yield Post_1.Post.find({
            communityId: community,
        })
            .skip(Number(skip))
            .limit(Number(limit))
            .populate("author communityId")
            .sort({ createdAt: -1 });
        const totalCommunityPosts = yield Post_1.Post.find({
            communityId: community,
        }).countDocuments();
        res.status(200).send({
            message: "Community posts",
            communityPosts,
            totalCommunityPosts,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: err });
    }
}));
