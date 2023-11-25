"use strict";
//change publicName, rules, description, avatar or banner of a community
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
exports.editCommunityRouter = void 0;
const Community_1 = require("./../../models/Community");
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const cloudinaryConfig_1 = __importDefault(require("../../config/cloudinaryConfig"));
const multer_filefilter_config_1 = __importDefault(require("../../config/multer.filefilter.config"));
const User_1 = require("../../models/User");
const currentuser_1 = require("../../middlewares/currentuser");
const Community_2 = require("../../models/Community");
const router = express_1.default.Router();
exports.editCommunityRouter = router;
router.put("/api/community/edit", currentuser_1.currentUser, multer_filefilter_config_1.default.fields([
    { name: "avatarImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { publicName, description, rules = [], tags = [], name } = req.body;
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
        const community = yield Community_1.Community.findOne({ name });
        if (!community) {
            throw new common_1.BadRequestError("Community not found, invalid name provided!");
        }
        console.log(existingUser);
        //loop through members and check if userId matches with existing user and if role is admin
        const isAdmin = (_a = community.members) === null || _a === void 0 ? void 0 : _a.some((member) => member.userId.toString() === existingUser.id.toString() &&
            member.role == Community_2.Role.Admin);
        if (!isAdmin) {
            throw new common_1.BadRequestError("You are not authorized to edit this community!");
        }
        // Update community details if they are different, otherwise fallback to existing values
        if ((publicName === null || publicName === void 0 ? void 0 : publicName.length) > 0) {
            //if publicName is being changed, then also modify the name accordingly
            community.publicName = publicName;
        }
        else {
            throw new common_1.BadRequestError("Public Name Cannot Be Empty!");
        }
        community.description = description || community.description;
        community.avatar = avatarImageUrl || community.avatar;
        community.banner = bannerImageUrl || community.banner;
        community.rules = rules || community.rules;
        community.tags = tags || community.tags;
        yield community.save();
        res.status(200).send({
            message: "Community edited successfully",
            community,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: err });
    }
}));
