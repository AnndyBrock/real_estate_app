import { Router } from "express";

import { createDraftPost, getPosts, publishPost } from "../controllers/post.controller";
import {
    uploadImages,
    removeImage
} from "../controllers/upload.controller";
import multer, {memoryStorage} from "multer";

import authenticate from "../middleware/authenticate";
import uploadRoute from "./upload.route";

const storage = memoryStorage();
const upload = multer({storage})

const postRoute = Router();

postRoute.get("/", getPosts);
postRoute.post("/", authenticate, createDraftPost);
postRoute.post(
    "/photo",
    authenticate,
    upload.array('image'),
    uploadImages
);
postRoute.patch("/:postId", authenticate, publishPost);
postRoute.delete("/photo/:key", removeImage);


export default postRoute;
