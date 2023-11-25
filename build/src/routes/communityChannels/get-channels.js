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
exports.getCommunityChannelsRouter = void 0;
const Community_1 = require("../../models/Community");
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.getCommunityChannelsRouter = router;
router.get("/api/community/channels/:name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    try {
        const communityDoc = yield Community_1.Community.findOne({ name }).populate("channels");
        if (!communityDoc) {
            throw new common_1.BadRequestError("Community not found!");
        }
        res.status(200).send(communityDoc.channels);
    }
    catch (e) {
        console.log(e);
        res.status(500).send({ message: e });
    }
}));
