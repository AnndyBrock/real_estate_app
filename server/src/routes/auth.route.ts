import { Router } from "express";

import {
    loginHandler,
    registerHandler,
    logoutHandler,
    refreshHandler,
    verifyEmailHandler,
    sendPasswordResetHandler,
    resetPasswordHandler
} from "../controllers/auth.controller";

const authRoute = Router();

authRoute.post("/register", registerHandler);
authRoute.post("/login", loginHandler);
authRoute.get("/logout", logoutHandler);
authRoute.get("/refresh", refreshHandler);
authRoute.get("/email/verify/:code", verifyEmailHandler);
authRoute.post("/password/forgot", sendPasswordResetHandler);
authRoute.post("/password/reset", resetPasswordHandler);

export default authRoute;
