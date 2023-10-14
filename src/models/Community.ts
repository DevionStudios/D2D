import mongoose from "mongoose";
import { UserDoc } from "./User";
import { PostDoc } from "./Post";

interface CommunityAttrs {
  publicName: string;
  name?: string;
  members?: UserDoc[];
  creator?: UserDoc;
  description?: string;
  avatar?: string;
  banner?: string;
  isSafeForWork?: boolean;
  rules?: string[];
  posts?: PostDoc[];
}

interface CommunityModel extends mongoose.Model<CommunityDoc> {
  build(attrs: CommunityAttrs): CommunityDoc;
}

export enum Role {
  Admin = "admin",
  Member = "member",
  Banned = "banned",
}

export interface MemberAttrs {
  userId: UserDoc;
  role: Role;
}
export interface CommunityDoc extends mongoose.Document {
  publicName?: string;
  name?: string;
  creator?: UserDoc;
  members?: MemberAttrs[];
  posts?: PostDoc[];
  description?: string;
  avatar?: string;
  banner?: string;
  isSafeForWork?: boolean;
  rules?: string[];
}

const CommunitySchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    publicName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    members: {
      type: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
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
          type: mongoose.Schema.Types.ObjectId,
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

CommunitySchema.set("timestamps", true);
CommunitySchema.statics.build = (attrs: CommunityAttrs) => {
  return new Community(attrs);
};

CommunitySchema.pre("save", async function (done) {
  if (this.isNew) {
    const publicName = this.get("publicName");
    const slug = generateSlug(publicName);
    const number = await Community.countDocuments({ publicName });
    const finalSlug = number > 0 ? `${slug}-${number}` : slug;
    this.set("name", finalSlug);
    this.members.push({
      userId: this.get("creator"),
      role: Role.Admin,
    });
  }
  done();
});

const Community = mongoose.model<CommunityDoc, CommunityModel>(
  "Community",
  CommunitySchema
);

function generateSlug(text: string): string {
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



export { Community, CommunitySchema };
