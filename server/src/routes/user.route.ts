import { Router } from "express";

import { getUserHandler } from "../controllers/user.controller";

const userRoute = Router();

userRoute.get("/", getUserHandler);

export default userRoute;
