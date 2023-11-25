"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityChannelSchema = exports.CommunityChannel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CommunityChannelSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    maxNumbers: { type: Number, default: 10 },
    public: { type: Boolean, default: true },
    community: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Community",
    },
    description: {
        type: String,
        default: "A channel!",
    },
    creator: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
});
exports.CommunityChannelSchema = CommunityChannelSchema;
CommunityChannelSchema.set("timestamps", true);
CommunityChannelSchema.statics.build = (attrs) => {
    return new CommunityChannel(attrs);
};
const CommunityChannel = mongoose_1.default.model("CommunityChannel", CommunityChannelSchema);
exports.CommunityChannel = CommunityChannel;
