import mongoose from "mongoose";

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
  post: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new mongoose.Schema<ContactDocument>(
  {
    email: { type: String, unique: true, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    agent: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { timestamps: true },
);

const ContactModel = mongoose.model<ContactDocument>("Contact", contactSchema);
export default ContactModel;
