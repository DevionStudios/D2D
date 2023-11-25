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
exports.validateCommunityChannelRouter = void 0;
const Community_1 = require("../../models/Community");
const CommunityChannel_1 = require("../../models/CommunityChannel");
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const currentuser_1 = require("../../middlewares/currentuser");
const router = express_1.default.Router();
exports.validateCommunityChannelRouter = router;
router.post("/api/community/channel/validate", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, channel } = req.body;
    try {
        if (!name) {
            throw new common_1.BadRequestError("Community name is required!");
        }
        const community = yield Community_1.Community.findOne({ name });
        if (!community) {
            throw new common_1.BadRequestError("Community not found!");
        }
        const channelDoc = yield CommunityChannel_1.CommunityChannel.findOne({
            name: channel,
            community,
        });
        if (!channelDoc)
            throw new common_1.BadRequestError("Channel does not exist in this community!");
        res.status(201).send("Channel exists!");
    }
    catch (e) {
        console.log(e);
        res.status(500).send({ message: e });
    }
}));
