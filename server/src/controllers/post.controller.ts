import catchErrors from "../utils/catchErrors";
import { CREATED, NOT_FOUND, OK } from "../constants/http";
import {draftPostSchema, postSchema} from "../schemas/post.schemas";
import { draftPost } from "../services/post.service";
import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import PostModel from "../models/post.model";

export const createDraftPost = catchErrors(async (req, res) => {
    const userId = res.locals?.userId;

    const user = await UserModel.findById(userId);
    appAssert(user, NOT_FOUND, "User not found");

    const request = draftPostSchema.parse(req.body);

    const post = await draftPost({ request, user });

    return res.status(CREATED).json(post);
});

export const publishPost = catchErrors(async (req, res) => {
    const userId = res.locals?.userId;
    const { postId } = req.params;

    const user = await UserModel.findById(userId);
    appAssert(user, NOT_FOUND, "User not found");

    const draftPost = await PostModel.findOne({
        _id: postId,
        status: "draft",
        "agent.id": userId,
    });
    appAssert(draftPost, NOT_FOUND, "Draft post not found");

    const updateData = postSchema.parse(req.body);

    Object.assign(draftPost, updateData, { status: "published" });
    await draftPost.save();

    return res.status(OK).json({
        success: true,
        message: "Post finalized successfully",
        post: draftPost,
    });
});

export const getPosts = catchErrors(async (req, res) => {
    const longitude = parseFloat(req.query.longitude as string);
    const latitude = parseFloat(req.query.latitude as string);
    const maxDistance = parseInt(req.query.maxDistance as string, 10) || 5000;

    let filter = {};

    if (!isNaN(longitude) && !isNaN(latitude)) {
        filter = {
            "address.coordinates": {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: maxDistance,
                },
            },
        };
    }

    const posts = await PostModel.find(filter);

    return res.status(OK).json({
        success: true,
        data: posts,
    });
});
