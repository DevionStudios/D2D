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
exports.moderateCommunityMembersRouter = void 0;
//change role of any member of a community -- ban/unban, make/remove admin
//can also be used to remove a member from a community
const Community_1 = require("../../models/Community");
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const User_1 = require("../../models/User");
const currentuser_1 = require("../../middlewares/currentuser");
const Community_2 = require("../../models/Community");
const router = express_1.default.Router();
exports.moderateCommunityMembersRouter = router;
router.put("/api/community/member/role/edit", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { userId, newRole, name } = req.body;
        const existingUser = yield User_1.User.findOne({ _id: req.foxxiUser.id });
        if (!existingUser) {
            throw new common_1.BadRequestError("User not found!");
        }
        const community = yield Community_1.Community.findOne({ name });
        if (!community) {
            throw new common_1.BadRequestError("Community not found, invalid name provided!");
        }
        //loop through members and check if userId matches with existing user and if role is admin
        const isAdmin = (_a = community.members) === null || _a === void 0 ? void 0 : _a.some((member) => member.userId.toString() === existingUser.id.toString() &&
            member.role == Community_2.Role.Admin);
        if (!isAdmin) {
            throw new common_1.BadRequestError("You are not authorized to edit this community!");
        }
        const otherUser = yield User_1.User.findOne({ _id: userId });
        if (!otherUser) {
            throw new common_1.BadRequestError("User not found!");
        }
        const memberIndex = community.members.findIndex((member) => member.userId.toString() === otherUser.id.toString());
        if (memberIndex === -1) {
            throw new common_1.BadRequestError("User is not part of community");
        }
        let memberObj = community.members[memberIndex];
        if (newRole === "admin") {
            // Update community details if they are different, otherwise fallback to existing values
            community.members[memberIndex] = {
                userId: otherUser.id,
                role: Community_2.Role.Admin,
            };
        }
        else if (newRole === "member" || newRole === "unbanned") {
            community.members[memberIndex] = {
                userId: otherUser.id,
                role: Community_2.Role.Member,
            };
        }
        else if (newRole === "banned") {
            community.members[memberIndex] = {
                userId: otherUser.id,
                role: Community_2.Role.Banned,
            };
        }
        else if (newRole === "remove") {
            (_b = community.members) === null || _b === void 0 ? void 0 : _b.splice(memberIndex, 1);
        }
        else {
            throw new common_1.BadRequestError("Invalid role");
        }
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
