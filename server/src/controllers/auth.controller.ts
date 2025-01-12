import { registerSchema, loginSchema, verificationCodeSchema, emailSchema, resetPasswordSchema } from "./auth.schemas";
import { CREATED, OK, UNAUTHORIZED } from "../constants/http";
import SessionModel from "../models/session.model";
import {
    createAccount,
    loginUser,
    refreshUserAccessToken, resetPassword,
    sendPasswordResetEmail,
    verifyEmail
} from "../services/auth.service";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import {
    clearAuthCookies,
    getAccessTokenCookieOptions,
    getRefreshTokenCookieOptions,
    setAuthCookies
} from "../utils/cookies";
import { verityToken } from "../utils/jwt";

export const registerHandler = catchErrors(async (req, res) => {
        const request = registerSchema.parse({
            ...req.body,
            userAgent: req.headers["user-agent"]
        });

        const { user, refreshToken, accessToken } = await createAccount(request);

        return setAuthCookies({ res, accessToken, refreshToken })
            .status(CREATED)
            .json(user);
    }
);

export const loginHandler = catchErrors(async (req, res) => {
    const request = loginSchema.parse({ ...req.body, userAgent: req.headers["user-agent"] });

    const { accessToken, refreshToken } = await loginUser(request);

    return setAuthCookies({ res, accessToken, refreshToken })
        .status(OK)
        .json({ message: "Login successful" });
});

export const logoutHandler = catchErrors(async (req, res) => {
    const accessToken = req.cookies.accessToken as string|undefined;
    const { payload } = verityToken(accessToken || "");

    if (payload) {
        await SessionModel.findByIdAndDelete(payload.sessionId);
    }

    return clearAuthCookies(res).status(OK).json({
        message: "Logout Successfully"
    });
});

export const refreshHandler = catchErrors( async (req, res) => {
    const refreshToken = req.cookies.refreshToken as string|undefined;

    appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token");

    const { accessToken, newRefreshToken } = await refreshUserAccessToken(refreshToken);

    if (newRefreshToken) {
        res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
    }

    return res.status(OK).cookie("accessToken", accessToken, getAccessTokenCookieOptions()).json({
        message: "Access token refreshed"
    });
});

export const verifyEmailHandler = catchErrors(async (req, res) => {
    const verificationCode = verificationCodeSchema.parse(req.params.code);

    const { user } = await verifyEmail(verificationCode);

    return res.status(OK).json({ user, message: "Email successfully verified" });
});

export const sendPasswordResetHandler = catchErrors(async (req, res) => {
    const email = emailSchema.parse(req.body.email);

    await sendPasswordResetEmail(email);

    return res.status(OK).json({ message: "Password reset email send" });
});

export const resetPasswordHandler = catchErrors(async (req, res) => {
    const request = resetPasswordSchema.parse(req.body);

    await resetPassword(request);

    return clearAuthCookies(res).status(OK).json({ message: "Password was changed" });
});