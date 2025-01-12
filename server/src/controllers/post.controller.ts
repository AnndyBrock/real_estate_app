import catchErrors from "../utils/catchErrors";
import { CREATED, NOT_FOUND, OK } from "../constants/http";
import { postSchema } from "../schemas/post.schemas";
import { createNewPost } from "../services/post.service";
import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import PostModel from "../models/post.model";

export const createPost = catchErrors(async (req, res) => {
    const userId = res.locals?.userId;

    const user = await UserModel.findById(userId);
    appAssert(user, NOT_FOUND, "User not found");

    const request = postSchema.parse({
        ...req.body,
        userAgent: req.headers["user-agent"],
    });

    const post = await createNewPost({ request, user });

    return res.status(CREATED).json(post);
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
