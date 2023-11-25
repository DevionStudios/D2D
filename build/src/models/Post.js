"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostSchema = exports.Post = exports.PostType = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var PostType;
(function (PostType) {
    PostType["CommunityPost"] = "CommunityPost";
    PostType["UserPost"] = "UserPost";
})(PostType = exports.PostType || (exports.PostType = {}));
const PostSchema = new mongoose_1.default.Schema({
    caption: {
        type: String,
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    hashtags: [
        {
            type: String,
        },
    ],
    likes: {
        type: [
            {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        default: [],
    },
    comments: {
        type: [
            {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
        default: [],
    },
    reposts: {
        type: Number,
        default: 0,
    },
    media: {
        type: {
            url: {
                type: String,
            },
            mediatype: {
                type: String,
            },
        },
        default: {
            url: "",
            mediatype: "",
        },
    },
    gifLink: {
        type: String,
        default: "",
    },
    twitterId: {
        type: String,
        default: "",
    },
    reports: {
        type: [
            {
                type: String,
            },
        ],
        default: [],
    },
    originalPostId: {
        type: String,
        default: "",
    },
    type: {
        type: String,
        default: PostType.UserPost,
    },
    communityId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Community",
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
exports.PostSchema = PostSchema;
PostSchema.set("timestamps", true);
PostSchema.statics.build = (attrs) => {
    return new Post(attrs);
};
const Post = mongoose_1.default.model("Post", PostSchema);
exports.Post = Post;
