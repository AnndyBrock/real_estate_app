import catchErrors from "../utils/catchErrors";
import appAssert from "../utils/appAssert";
import { CREATED, NOT_FOUND, UNAUTHORIZED, OK } from "../constants/http";
import ContactModel from "../models/lead.model";
import LeadModel from "../models/lead.model";
import UserModel from "../models/user.model";
import PostModel from "../models/post.model";
import { leadSchema } from "../schemas/lead.schemas";
import mongoose from "mongoose";

export const getAgentContacts = catchErrors(async (req, res) => {
  const userId = res.locals?.userId;
  appAssert(userId, UNAUTHORIZED, "User ID not found");

  // Convert userId to ObjectId using `new`
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const contacts = await ContactModel.find({ "agent.id": userObjectId });
  return res.status(OK).json(contacts);
});

export const getContactById = catchErrors(async (req, res) => {
  const userId = res.locals?.userId;
  const { id } = req.params;
  appAssert(userId, UNAUTHORIZED, "User ID not found");

  const contact = await ContactModel.findOne({ _id: id, agentId: userId });
  appAssert(contact, NOT_FOUND, "Contact not found");

  return res.status(OK).json(contact);
});

export const createAgentContact = catchErrors(async (req, res) => {
  const userId = res.locals?.userId;
  const contactData = req.body;
  appAssert(userId, UNAUTHORIZED, "User ID not found");

  const agent = await UserModel.findById(userId);

  const newContact = await ContactModel.create({
    ...contactData,
    agent,
  });
  return res.status(CREATED).json(newContact);
});

export const updateAgentContact = catchErrors(async (req, res) => {
  const userId = res.locals?.userId;
  const contactData = req.body;
  appAssert(userId, UNAUTHORIZED, "User ID not found");

  const agent = await UserModel.findById(userId);

  const newContact = await ContactModel.create({
    ...contactData,
    agent,
  });

  return res.status(CREATED).json(newContact);
});
export const createLead = catchErrors(async (req, res) => {
  // Parse and validate the request body using the lead schema
  const parsedData = leadSchema.parse(req.body);

  const { leadData, postId } = parsedData;

  const post = await PostModel.findById(postId);
  appAssert(post, NOT_FOUND, "Post not found");

  const { agent: postAgent } = post;
  appAssert(postAgent, NOT_FOUND, "Agent not found");

  const existingLead = await LeadModel.findOne({ email: leadData.email });

  if (existingLead) {
    return res.status(CREATED).json(existingLead);
  }

  const newLead = await LeadModel.create({
    email: leadData.email,
    firstName: leadData.firstName,
    lastName: leadData.lastName,
    phone: leadData.phone,
    agent: {
      id: postAgent.id,
      firstName: postAgent.firstName,
      lastName: postAgent.lastName,
    },
    post: {
      postId,
      address: post.address,
    },
  });

  return res.status(CREATED).json(newLead);
});
