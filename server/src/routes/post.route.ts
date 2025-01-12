import { Router } from "express";

import { createPost, getPosts } from "../controllers/post.controller";
import authenticate from "../middleware/authenticate";

const postRoute = Router();

postRoute.get("/", getPosts);
postRoute.post("/", authenticate, createPost);

export default postRoute;
