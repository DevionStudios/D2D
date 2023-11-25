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
exports.createCommunityRouter = void 0;
const Community_1 = require("./../../models/Community");
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const cloudinaryConfig_1 = __importDefault(require("../../config/cloudinaryConfig"));
const multer_filefilter_config_1 = __importDefault(require("../../config/multer.filefilter.config"));
const User_1 = require("../../models/User");
const currentuser_1 = require("../../middlewares/currentuser");
const router = express_1.default.Router();
exports.createCommunityRouter = router;
router.put("/api/community/create", currentuser_1.currentUser, multer_filefilter_config_1.default.fields([
    { name: "avatarImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { publicName, description, rules = [], tags = [], isSafeForWork = true, } = req.body;
        let avatarImageUrl = "", bannerImageUrl = "";
        if (req.files) {
            const files = req.files;
            if (files.avatarImage && files.avatarImage.length > 0) {
                const imageFilePath = files.image[0].path;
                var result = yield cloudinaryConfig_1.default.uploader.upload(imageFilePath);
                avatarImageUrl = result.secure_url;
            }
            if (files.bannerImage && files.bannerImage.length > 0) {
                const bannerImageFilePath = files.bannerImage[0].path;
                var result = yield cloudinaryConfig_1.default.uploader.upload(bannerImageFilePath);
                bannerImageUrl = result.secure_url;
            }
        }
        const existingUser = yield User_1.User.findOne({ _id: req.foxxiUser.id });
        if (!existingUser) {
            throw new common_1.BadRequestError("User not found!");
        }
        if (!publicName) {
            throw new common_1.BadRequestError("Community name is required!");
        }
        const tagsArray = tags.split(",");
        const rulesArray = rules.split(",");
        const newCommunity = Community_1.Community.build({
            publicName,
            creator: existingUser,
            description,
            rules: rulesArray,
            avatar: avatarImageUrl,
            banner: bannerImageUrl,
            members: [],
            tags: tagsArray,
            isSafeForWork,
        });
        yield newCommunity.save();
        (_a = existingUser.joinedCommunities) === null || _a === void 0 ? void 0 : _a.push(newCommunity.id);
        yield existingUser.save();
        res.status(201).send({
            message: "Community created successfully",
            newCommunity,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: err });
    }
}));
