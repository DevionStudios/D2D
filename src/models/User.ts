import mongoose from "mongoose";
import { Password } from "../services/password";
import { PostDoc } from "./Post";

interface UserAttrs {
  email?: string;
  password?: string;
  username: string;
  name: string;
  walletAddress?: string;
  image?: string;
  coverImage?: string;
  bio?: string;
  followers?: UserDoc[];
  following?: UserDoc[];
  posts?: PostDoc[];
  hasClaimed?: boolean;
  twitterUsername?: string;
  accountWallet?: string;
  reports?: string[];
  isBanned?: boolean;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

export interface UserDoc extends mongoose.Document {
  email?: string;
  password?: string;
  username?: string;
  name?: string;
  walletAddress?: string;
  image?: string;
  coverImage?: string;
  bio?: string;
  followers?: UserDoc[];
  following?: UserDoc[];
  hashtagsfollowed?: string[];
  posts?: PostDoc[];
  updatedAt?: Date;
  createdAt?: Date;
  hasClaimed?: boolean;
  twitterUsername?: string;
  accountWallet?: string;
  reports?: string[];
  isBanned?: boolean;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: false,
    },
    username: {
      type: String,
    },
    name: {
      type: String,
    },
    password: {
      type: String,
      required: false,
    },
    walletAddress: {
      type: String,
    },
    hasClaimed: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default:
        "https://i.pinimg.com/474x/66/ff/cb/66ffcb56482c64bdf6b6010687938835.jpg",
    },
    coverImage: {
      type: String,
    },
    bio: {
      type: String,
      default: "I am a new user",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    hashtagsfollowed: {
      type: [
        {
          type: String,
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
    twitterUsername: {
      type: String,
      dafault: "",
    },
    accountWallet: {
      type: String,
      default: "",
      required: false,
    },
    reports: {
      type: [
        {
          type: String,
        },
      ],
      default: [],
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);
userSchema.set("timestamps", true);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
