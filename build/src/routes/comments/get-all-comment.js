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
exports.getAllCommentRouter = void 0;
const express_1 = __importDefault(require("express"));
const Comment_1 = require("../../models/Comment");
const router = express_1.default.Router();
exports.getAllCommentRouter = router;
router.get("/api/comments/getall", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield Comment_1.Comment.find({});
        res.status(200).send(comments);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: err });
    }
}));
