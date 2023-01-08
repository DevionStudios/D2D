import mongoose from "mongoose";
import { UserDoc } from "./User";

interface CommentAttrs {
  caption: string;
  author: UserDoc;
  postId: string;
}

interface CommentModel extends mongoose.Model<CommentDoc> {
  build(attrs: CommentAttrs): CommentDoc;
}

export interface CommentDoc extends mongoose.Document {
  caption: string;
  postId: string;
  author: UserDoc;
}

const CommentSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    postId: {
      type: String,
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

CommentSchema.set("timestamps", true);
CommentSchema.statics.build = (attrs: CommentAttrs) => {
  return new Comment(attrs);
};

const Comment = mongoose.model<CommentDoc, CommentModel>(
  "Comment",
  CommentSchema
);

export { Comment, CommentSchema };
