import mongoose from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";

export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: string;
  company: string;
  phone: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(val: string): Promise<boolean>;

  omitPassword(): Pick<
    UserDocument,
    // @ts-expect-error eslint-disable-next-line @typescript-eslint/ban-ts-comment
    | "_id"
    | "email"
    | "firstName"
    | "lastName"
    | "userType"
    | "company"
    | "phone"
    | "verified"
    | "createdAt"
    | "updatedAt"
    | "__v"
  >;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userType: { type: String, required: true },
    company: { type: String },
    phone: { type: String, required: true },
    verified: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await hashValue(this.password);
  next();
});

userSchema.methods.comparePassword = async function (val: string) {
  return compareValue(val, this.password);
};

userSchema.methods.omitPassword = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;
