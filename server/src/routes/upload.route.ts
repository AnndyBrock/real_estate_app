import { Router } from "express";

import {
    uploadImage,
    getImage,
    removeImage
} from "../controllers/upload.controller";
import multer, {memoryStorage} from "multer";

const storage = memoryStorage();
const upload = multer({storage})

const uploadRoute = Router();

uploadRoute.get("/", getImage);
uploadRoute.post("/", upload.single('image'), uploadImage);
uploadRoute.delete("/:key", removeImage);

export default uploadRoute;
