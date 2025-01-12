import { RequestHandler } from "express";
import appAssert from "../utils/appAssert";
import AppErrorCode from "../constants/appErrorCode";
import { UNAUTHORIZED } from "../constants/http";
import { verityToken } from "../utils/jwt";

// wrap with catchErrors() if you need this to be async
const authenticate: RequestHandler = (req, res, next) => {
    const accessToken = req.cookies.accessToken as string | undefined;
    appAssert(
        accessToken,
        UNAUTHORIZED,
        "Not authorized",
        AppErrorCode.InvalidAccessToken
    );

    const { error, payload } = verityToken(accessToken);
    appAssert(
        payload,
        UNAUTHORIZED,
        error === "jwt expired" ? "Token expired" : "Invalid token",
        AppErrorCode.InvalidAccessToken
    );

    res.locals.userId = payload.userId;
    res.locals.sessionId = payload.sessionId;

    next();
};

export default authenticate;
