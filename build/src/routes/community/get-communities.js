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
exports.getCommunitiesRouter = void 0;
//discover page
//get all communities
const Community_1 = require("./../../models/Community");
//get community sorted by trending or new
const express_1 = __importDefault(require("express"));
const currentuser_1 = require("../../middlewares/currentuser");
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
exports.getCommunitiesRouter = router;
router.get("/api/community/discover", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit = 20, skip = 0 } = req.query;
        const communities = yield Community_1.Community.find({
            "members.userId": {
                $ne: new mongoose_1.default.Types.ObjectId(req.foxxiUser.id),
            },
        })
            .skip(Number(skip))
            .limit(Number(limit))
            .sort({ createdAt: -1 });
        const totalCommunities = yield Community_1.Community.find({
            "members.userId": {
                $ne: new mongoose_1.default.Types.ObjectId(req.foxxiUser.id),
            },
        }).countDocuments();
        res.status(200).send({
            message: "Communities",
            communities,
            totalCommunities,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: err });
    }
}));
