import mongoose, { StringExpressionOperatorReturningBoolean } from "mongoose";
import { UserDoc } from "./User";

interface PostAttrs {
  content: string;
  author: UserDoc;
  hashtags?: string[];
  likes?: number;
  comments?: number;
  reposts?: number;
  media?: string;
  gifLink?: string;
}

interface PostModel extends mongoose.Model<PostDoc> {
  build(attrs: PostAttrs): PostDoc;
}

export interface PostDoc extends mongoose.Document {
  content: string;
  author: UserDoc;
  hashtags?: string[];
  likes?: number;
  comments?: number;
  reposts?: number;
  updatedAt?: Date;
  createdAt?: Date;
  media?: String;
  gifLink?: String;
}

const PostSchema = new mongoose.Schema(
  {
    content: {
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
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    reposts: {
      type: Number,
      default: 0,
    },
    media: {
      type: String,
      default: null,
    },
    gifLink: {
      type: String,
      default: null,
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
