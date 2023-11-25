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
exports.joinCommunityRouter = void 0;
//joining and leaving community routes (admins can also use this same route)
const Community_1 = require("./../../models/Community");
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const User_1 = require("../../models/User");
const currentuser_1 = require("../../middlewares/currentuser");
const router = express_1.default.Router();
exports.joinCommunityRouter = router;
router.put("/api/community/join/:name", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
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
        const existingMember = (_a = community.members) === null || _a === void 0 ? void 0 : _a.findIndex((member) => member.userId.toString() === existingUser.id.toString());
        if (existingMember !== -1) {
            throw new common_1.BadRequestError("You are already a member of this community!");
        }
        (_b = community.members) === null || _b === void 0 ? void 0 : _b.push({
            userId: existingUser.id,
            role: Community_1.Role.Member,
        });
        yield community.save();
        (_c = existingUser.joinedCommunities) === null || _c === void 0 ? void 0 : _c.push(community.id);
        yield existingUser.save();
        res.status(200).send({
            message: "member joined community successfully",
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: err });
    }
}));
