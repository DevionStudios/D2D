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
exports.getCommunityUsersRouter = void 0;
//get list of members in community
const Community_1 = require("./../../models/Community");
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.getCommunityUsersRouter = router;
router.get("/api/community/users/:name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.params; //name of community
        const { limit = 20, skip = 0 } = req.query;
        const community = yield Community_1.Community.findOne({ name }).populate("members.userId");
        if (!community) {
            throw new common_1.BadRequestError("Community not found, invalid name provided!");
        }
        const communityMembers = community.members.slice(skip, limit + skip);
        const totalCommunityMembers = community.members.length;
        res.status(200).send({
            message: "Community Members",
            communityMembers,
            totalCommunityMembers,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: err });
    }
}));
