import mongoose from "mongoose";
import { UserDoc } from "./User";

interface StoryAttrs {
  caption: string;
  author: UserDoc;
  media?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface StoryModel extends mongoose.Model<StoryDoc> {
  build(attrs: StoryAttrs): StoryDoc;
}

export interface StoryDoc extends mongoose.Document {
  caption: string;
  author: UserDoc;
  updatedAt?: Date;
  createdAt?: Date;
  media?: String;
}

const StorySchema = new mongoose.Schema(
  {
    caption: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    media: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 86400,
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

StorySchema.set("timestamps", true);
StorySchema.statics.build = (attrs: StoryAttrs) => {
  return new Story(attrs);
};

const Story = mongoose.model<StoryDoc, StoryModel>("Story", StorySchema);

export { Story, StorySchema };
