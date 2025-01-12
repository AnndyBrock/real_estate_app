import catchErrors from "../utils/catchErrors";
import { NOT_FOUND, OK } from "../constants/http";
import SessionModel from "../models/session.model";
import { z } from "zod";
import appAssert from "../utils/appAssert";

export const getSessionHandler = catchErrors(async (req, res) => {
    const userId = res.locals?.userId;
    const sessionId = res.locals?.sessionId;

    const sessions = await SessionModel.find({
        userId,
        expiresAt: { $gt: new Date() }
    },{
        _id: 1, userAgent: 1, createdAt: 1
    }, { sort: { createdAt: -1 } });

    res.status(OK).json(sessions.map(x => ({
        ...x.toObject(), ...(x.id === sessionId && { isCurrent: true })
    })));
});

export const deleteSessionHandler = catchErrors(async (req, res) => {
    const sessionId = z.string().parse(req.params.id);
    const userId = res.locals?.userId;

    const deleted = await SessionModel.findOneAndDelete({
        _id: sessionId,
        userId
    });

    appAssert(deleted, NOT_FOUND, "Session not found");

    return res.status(OK).json({ message: "Session removed" });
});
