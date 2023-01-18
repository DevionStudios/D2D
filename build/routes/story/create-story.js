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
exports.createStoryRouter = void 0;
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const Story_1 = require("../../models/Story");
const User_1 = require("../../models/User");
const cloudinaryConfig_1 = __importDefault(require("../../config/cloudinaryConfig"));
const multer_filefilter_config_1 = __importDefault(require("../../config/multer.filefilter.config"));
const currentuser_1 = require("../../middlewares/currentuser");
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
exports.createStoryRouter = router;
router.post("/api/story/create", currentuser_1.currentUser, multer_filefilter_config_1.default.single("media"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { caption } = req.body;
        const result = req.file
            ? yield cloudinaryConfig_1.default.uploader.upload(req.file.path)
            : null;
        const media = (result === null || result === void 0 ? void 0 : result.secure_url) || "";
        const existingUser = yield User_1.User.findOne({
            _id: new mongoose_1.default.Types.ObjectId(req.foxxiUser.id),
        });
        if (!existingUser) {
            throw new common_1.BadRequestError("User not found!");
        }
        const story = Story_1.Story.build({
            caption,
            media,
            author: existingUser,
        });
        existingUser === null || existingUser === void 0 ? void 0 : existingUser.stories.push(story);
        yield story.save();
        yield existingUser.save();
        res.status(201).send({
            message: "Story created successfully",
        });
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ message: err });
    }
}));
