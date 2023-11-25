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
exports.CommunitySchema = exports.Community = exports.Role = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var Role;
(function (Role) {
    Role["Admin"] = "admin";
    Role["Member"] = "member";
    Role["Banned"] = "banned";
})(Role = exports.Role || (exports.Role = {}));
const CommunitySchema = new mongoose_1.default.Schema({
    creator: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    publicName: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: false,
    },
    members: {
        type: [
            {
                userId: {
                    type: mongoose_1.default.Schema.Types.ObjectId,
                    ref: "User",
                },
                role: {
                    type: String,
                    enum: Object.values(Role),
                    default: Role.Member,
                },
            },
        ],
        default: [],
    },
    posts: {
        type: [
            {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
        default: [],
    },
    description: {
        type: String,
        default: "",
    },
    avatar: {
        type: String,
        default: "",
    },
    banner: {
        type: String,
        default: "",
    },
    isSafeForWork: {
        type: Boolean,
        default: true,
    },
    rules: {
        type: [String],
        default: [],
    },
    tags: {
        type: [String],
        default: [],
    },
    channels: {
        type: [
            {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "CommunityChannel",
            },
        ],
        default: [],
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
exports.CommunitySchema = CommunitySchema;
CommunitySchema.set("timestamps", true);
CommunitySchema.statics.build = (attrs) => {
    return new Community(attrs);
};
CommunitySchema.pre("save", function (done) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isNew) {
            const publicName = this.get("publicName");
            const slug = generateSlug(publicName);
            const number = yield Community.countDocuments({ publicName });
            const finalSlug = number > 0 ? `${slug}-${number}` : slug;
            this.set("name", finalSlug);
            this.members.push({
                userId: this.get("creator"),
                role: Role.Admin,
            });
        }
        done();
    });
});
const Community = mongoose_1.default.model("Community", CommunitySchema);
exports.Community = Community;
function generateSlug(text) {
    return text
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "");
}
