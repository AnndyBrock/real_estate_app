import catchErrors from "../utils/catchErrors";
import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import { NOT_FOUND } from "../constants/http";
import { OK } from "../constants/http";

export const getUserHandler = catchErrors(async (req, res) => {
    const userId = res.locals?.userId;

    const user = await UserModel.findById(userId);

    appAssert(user, NOT_FOUND, "User not found");

    res.status(OK).json(user.omitPassword());
});
