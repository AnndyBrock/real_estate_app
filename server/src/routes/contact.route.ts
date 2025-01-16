import { Router } from "express";

import {
  getAgentContacts,
  getContactById,
  createLead,
  updateAgentContact,
  createAgentContact,
} from "../controllers/contact.controller";
import authenticate from "../middleware/authenticate";

const contactRoute = Router();

contactRoute.post("/", createLead);
contactRoute.get("/agent/", authenticate, getAgentContacts);
contactRoute.get("/agent/:id", authenticate, getContactById);
contactRoute.post("/agent/", authenticate, createAgentContact);
contactRoute.patch("/agent/", authenticate, updateAgentContact);

export default contactRoute;
