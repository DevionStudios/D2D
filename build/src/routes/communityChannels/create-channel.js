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
exports.createCommunityChannelRouter = void 0;
const Community_1 = require("../../models/Community");
const CommunityChannel_1 = require("../../models/CommunityChannel");
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const User_1 = require("../../models/User");
const currentuser_1 = require("../../middlewares/currentuser");
const router = express_1.default.Router();
exports.createCommunityChannelRouter = router;
router.post("/api/community/channel/create", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { name, channelName, description = "", maxNumbers = 10, isPublic = false, } = req.body;
    try {
        console.log(req.body);
        const existingUser = yield User_1.User.findOne({ _id: req.foxxiUser.id });
        if (!existingUser) {
            throw new common_1.BadRequestError("User not found!");
        }
        if (!name) {
            throw new common_1.BadRequestError("Community name is required!");
        }
        const community = yield Community_1.Community.findOne({ name });
        if (!community) {
            throw new common_1.BadRequestError("Community not found!");
        }
        //check if existingUser is an admin of the community
        const existingAdmin = community.members.find((member) => member.userId.toString() === req.foxxiUser.id.toString() &&
            member.role === "admin");
        if (!existingAdmin) {
            throw new common_1.BadRequestError("You are not authorized to create a channel!");
        }
        const existingChannel = (_a = community.channels) === null || _a === void 0 ? void 0 : _a.find((channel) => channel.name === channelName);
        if (existingChannel) {
            throw new common_1.BadRequestError("Channel already exists!");
        }
        const newChannel = CommunityChannel_1.CommunityChannel.build({
            name: channelName,
            maxNumbers,
            community,
            creator: existingUser,
            description,
            public: isPublic,
        });
        yield newChannel.save();
        (_b = community.channels) === null || _b === void 0 ? void 0 : _b.push(newChannel);
        yield community.save();
        res.status(201).send(newChannel);
    }
    catch (e) {
        console.log(e);
        res.status(500).send({ message: e });
    }
}));
