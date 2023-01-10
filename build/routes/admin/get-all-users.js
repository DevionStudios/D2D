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
exports.getAllUserRouter = void 0;
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const User_1 = require("../../models/User");
const router = express_1.default.Router();
exports.getAllUserRouter = router;
router.get("/api/admin/getusers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield User_1.User.find()
            .populate("followers")
            .populate("following");
        if (!existingUser) {
            throw new common_1.BadRequestError("User not found!");
        }
        res.status(200).send(existingUser);
    }
    catch (err) {
        console.log(err);
        res.status(200).send({ message: err });
    }
}));
