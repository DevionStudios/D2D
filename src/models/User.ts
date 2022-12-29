import mongoose from "mongoose";
import { Password } from "../services/password";
import { PostDoc } from "./Post";

interface UserAttrs {
  email: string;
  password: string;
  username: string;
  name: string;
  walletAddress?: string;
  image?: string;
  coverImage?: string;
  bio?: string;
  followers?: UserDoc[];
  following?: UserDoc[];
  posts?: PostDoc[];
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
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    username: {
      type: String,
    },
    name: {
      type: String,
    },
    password: {
      type: String,
    },
    walletAddress: {
      type: String,
    },
    image: {
      type: String,
      default:
        "https://i.pinimg.com/474x/66/ff/cb/66ffcb56482c64bdf6b6010687938835.jpg",
    },
    coverImage: {
      type: String,
      default:
        "https://149369349.v2.pressablecdn.com/wp-content/uploads/2012/10/twitter-cover.jpg",
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
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    hashtagsfollowed: [
      {
        type: String,
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
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
