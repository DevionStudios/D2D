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
exports.leaveCommunityRouter = void 0;
//joining and leaving community routes
const Community_1 = require("./../../models/Community");
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const User_1 = require("../../models/User");
const currentuser_1 = require("../../middlewares/currentuser");
const router = express_1.default.Router();
exports.leaveCommunityRouter = router;
router.put("/api/community/leave/:name", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const existingUser = yield User_1.User.findOne({ _id: req.foxxiUser.id });
        if (!existingUser) {
            throw new common_1.BadRequestError("User not found!");
        }
        const { name } = req.params;
        const community = yield Community_1.Community.findOne({ name });
        if (!community) {
            throw new common_1.BadRequestError("Community not found, invalid name provided!");
        }
        //check if user is already not a member of the community
        let existingMember = -1;
        existingMember = community.members.findIndex((member) => member.userId.toString() === existingUser.id.toString());
        if (existingMember == -1) {
            throw new common_1.BadRequestError("You are not a member of this community!");
        }
        const memberDoc = community.members[existingMember].userId;
        if (((_a = community.creator) === null || _a === void 0 ? void 0 : _a.toString()) == memberDoc.toString())
            throw new common_1.BadRequestError("You cannot leave the community as you are the creator");
        community.members.splice(existingMember, 1);
        yield community.save();
        //Removing community from user's joinedCommunities array
        existingUser.joinedCommunities = (_b = existingUser.joinedCommunities) === null || _b === void 0 ? void 0 : _b.filter((community1) => community1.toString() !== community.id.toString());
        yield existingUser.save();
        res.status(200).send({
            message: "member has left the community",
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: err });
    }
}));
