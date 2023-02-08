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
exports.deleteNotificationRouter = void 0;
const express_1 = __importDefault(require("express"));
const Notification_1 = require("../../models/Notification");
const currentuser_1 = require("../../middlewares/currentuser");
const router = express_1.default.Router();
exports.deleteNotificationRouter = router;
router.delete("/api/notification/delete", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const deletedNotifications = yield Notification_1.Notification.deleteMany({
            userId: (_a = req.foxxiUser) === null || _a === void 0 ? void 0 : _a.id.toString(),
        });
        console.log(deletedNotifications);
        res.status(201).send({ message: "Notifications deleted!" });
    }
    catch (err) {
        console.log(err);
        res.send({ message: err });
    }
}));
