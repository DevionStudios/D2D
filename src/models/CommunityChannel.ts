import mongoose from "mongoose";
import { CommunityDoc } from "./Community";
import { UserDoc } from "./User";

interface CommunityChannelAttrs {
  name: string;
  maxNumbers: number;
  community: CommunityDoc;
  creator: UserDoc;
  description?: string;
  public: boolean;
}

interface CommunityChannelModel extends mongoose.Model<CommunityChannelDoc> {
  build(attrs: CommunityChannelAttrs): CommunityChannelDoc;
}

export interface CommunityChannelDoc extends mongoose.Document {
  name: string;
  maxNumbers: number;
  community: CommunityDoc;
  creator: UserDoc;
  public: boolean;
  description?: string;
}

const CommunityChannelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    maxNumbers: { type: Number, default: 10 },
    public: { type: Boolean, default: true },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
    description: {
      type: String,
      default: "A channel!",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

CommunityChannelSchema.set("timestamps", true);
CommunityChannelSchema.statics.build = (attrs: CommunityChannelAttrs) => {
  return new CommunityChannel(attrs);
};

const CommunityChannel = mongoose.model<
  CommunityChannelDoc,
  CommunityChannelModel
>("CommunityChannel", CommunityChannelSchema);

export { CommunityChannel, CommunityChannelSchema };
