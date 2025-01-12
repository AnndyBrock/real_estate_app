import { Request, Response } from "express";
import catchErrors from "../utils/catchErrors";
import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import {BAD_REQUEST, NOT_FOUND, OK} from "../constants/http";
import {getUserSignedUrl, removeImageFromS3, uploadToS3} from "../utils/s3";
import {z} from "zod";

/**
 * Upload an image for the current user.
 */
export const uploadImage = catchErrors(async (req, res) => {
    const userId = res.locals?.userId as string;

    const user = await UserModel.findById(userId);
    appAssert(user, NOT_FOUND, "User not found");

    const { file } = req;
    appAssert(file, NOT_FOUND, "Bad request");

    const { key, error } = await uploadToS3({ file, userId });

    return res.status(OK).json({ key, error });
});

/**
 * Get pre-signed URLs for all images that belong to the current user.
 */
export const getImage = catchErrors(async (req: Request, res: Response) => {
    const userId = res.locals?.userId as string;

    const user = await UserModel.findById(userId);
    appAssert(user, NOT_FOUND, "User not found");

    const { preSignedUrls, error } = await getUserSignedUrl(userId);

    return res.status(OK).json({ preSignedUrls, error });
});

/**
 * Remove an image from S3 belonging to current user.
 */
export const removeImage = catchErrors(async (req: Request, res: Response) => {
    const rawKey = req.params.key;

    const decodedKey = decodeURIComponent(rawKey);

    const key = z.string().parse(decodedKey);

    const userId = res.locals?.userId;
    appAssert(key, BAD_REQUEST, "Could not parse key from imageUrl");

    const user = await UserModel.findById(userId);
    appAssert(user, NOT_FOUND, "User not found");

    const { success, error } = await removeImageFromS3(key);

    if (!success) {
        return res.status(500).json({ error: "Could not remove the image", details: error });
    }

    return res.json({ success: true });
});
