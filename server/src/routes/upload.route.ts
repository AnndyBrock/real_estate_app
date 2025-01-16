import { Router } from "express";

import {
  uploadImages,
  getImage,
  removeImage,
} from "../controllers/upload.controller";
import multer, { memoryStorage } from "multer";

const storage = memoryStorage();
const upload = multer({ storage });

const uploadRoute = Router();

uploadRoute.get("/", getImage);
uploadRoute.post("/", upload.single("image"), uploadImages);
uploadRoute.delete("/:key", removeImage);

export default uploadRoute;
