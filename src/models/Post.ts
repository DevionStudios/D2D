import mongoose from "mongoose";
import { CommentDoc } from "./Comment";
import { UserDoc } from "./User";

interface PostAttrs {
  caption: string;
  author: UserDoc;
  hashtags?: string[];
  likes?: UserDoc[];
  comments?: CommentDoc[];
  reposts?: number;
  media?: string;
  gifLink?: string;
  twitterId?: string;
  createdAt?: Date;
  reports?: string[];
}

interface PostModel extends mongoose.Model<PostDoc> {
  build(attrs: PostAttrs): PostDoc;
}

export interface PostDoc extends mongoose.Document {
  caption: string;
  author: UserDoc;
  hashtags?: string[];
  likes?: UserDoc[];
  comments?: CommentDoc[];
  reposts?: number;
  updatedAt?: Date;
  createdAt?: Date;
  media?: String;
  gifLink?: String;
  twitterId?: string;
  reports?: string[];
}

const PostSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
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
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    comments: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment",
        },
      ],
      default: [],
    },
    media: {
      type: String,
      default: null,
    },
    gifLink: {
      type: String,
      default: null,
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
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

PostSchema.set("timestamps", true);
PostSchema.statics.build = (attrs: PostAttrs) => {
  return new Post(attrs);
};

const Post = mongoose.model<PostDoc, PostModel>("Post", PostSchema);

export { Post, PostSchema };
