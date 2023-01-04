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
exports.updatePostRouter = void 0;
const express_1 = __importDefault(require("express"));
const common_1 = require("@devion/common");
const currentuser_1 = require("../../middlewares/currentuser");
const Post_1 = require("../../models/Post");
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
exports.updatePostRouter = router;
router.put("/api/posts/edit/:id", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { caption } = req.body;
    const { id } = req.params;
    const user = req.currentUser;
    console.log("Caption is:", caption);
    const post = yield Post_1.Post.findById(new mongoose_1.default.Types.ObjectId(id)).populate("author");
    if (!post) {
        throw new common_1.BadRequestError("Post not found");
    }
    if (post.author.id !== user.id) {
        throw new common_1.BadRequestError("You are not authorized to edit this post");
    }
    post.caption = caption;
    yield post.save();
    res.send(post);
}));
