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
exports.getUserOrdinalsRouter = void 0;
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const router = express_1.default.Router();
exports.getUserOrdinalsRouter = router;
router.get("/api/token/testordinal", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { hiroOrdinalAddress, unisatAddress } = req.query;
        let hiroResponse, unisatResponse;
        // get all the ordinals from https://api.hiro.so/ordinals/v1/inscriptions?address=<bitcoinWallet>
        if (hiroOrdinalAddress)
            hiroResponse = yield axios_1.default.get(`https://api.hiro.so/ordinals/v1/inscriptions?address=${hiroOrdinalAddress}`);
        if (unisatAddress)
            unisatResponse = yield axios_1.default.get(`https://api.hiro.so/ordinals/v1/inscriptions?address=${unisatAddress}`);
        let ordinals = [];
        if (hiroResponse)
            ordinals = [...ordinals, ...hiroResponse.data];
        if (unisatResponse)
            ordinals = [...ordinals, ...unisatResponse.data];
        res.status(200).send(ordinals);
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ message: error });
    }
}));
