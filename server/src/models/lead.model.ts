import mongoose from "mongoose";
import { z } from "zod";

export interface ContactDocument extends mongoose.Document {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  agent: {
    id: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
  };
  post: {
    postId: string;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new mongoose.Schema<ContactDocument>(
  {
    email: { type: String, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, unique: true, required: true },
    agent: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    post: {
      postId: { type: String },
      address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        postalCode: { type: String },
      },
    },
  },
  { timestamps: true },
);

const ContactModel = mongoose.model<ContactDocument>("Contact", contactSchema);
export default ContactModel;
