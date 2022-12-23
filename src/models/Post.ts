import mongoose from "mongoose";
import { UserDoc } from "./User";

interface PostAttrs {
  content: string;
  author: UserDoc;
  hashtags?: string[];
  likes?: number;
  comments?: number;
  reposts?: number;
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

PostSchema.statics.build = (attrs: PostAttrs) => {
  return new Post(attrs);
};

const Post = mongoose.model<PostDoc, PostModel>("post", PostSchema);

export { Post };
