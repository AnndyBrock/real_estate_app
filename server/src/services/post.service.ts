import appAssert from "../utils/appAssert";
import { CONFLICT } from "../constants/http";
import PostModel from "../models/post.model";

export const draftPost = async (data: { request: any; user: any }) => {
    const { request, user } = data;

    const existingListing = await PostModel.exists({
        "address.street": request.address.street,
        "address.city": request.address.city,
        "address.state": request.address.state,
        "address.country": request.address.country,
        type: request.type,
    });

    appAssert(!existingListing, CONFLICT, "Listing already exists");

    return PostModel.create({
        ...request,
        agent: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
        },
    });
};
