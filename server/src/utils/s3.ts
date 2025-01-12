// s3.ts
import {
    GetObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
    DeleteObjectCommand
} from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
    region: process.env.AWS_REGION,
});

const BUCKET = process.env.BUCKET ?? "";

/**
 * The object we receive, containing the file buffer and MIME type.
 */
export interface UploadParams {
    file: {
        buffer: Buffer;
        mimetype: string;
    };
    userId: string; // plain string
}

/**
 * Possible result of an upload: either a key or an error.
 */
export interface UploadResult {
    key?: string;
    error?: unknown;
}

/**
 * Upload a file to an S3 bucket under a path derived from userId + UUID.
 */
export async function uploadToS3({
                                     file,
                                     userId,
                                 }: UploadParams): Promise<UploadResult> {
    const key = `${userId}/${uuid()}`;
    const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    });

    try {
        await s3.send(command);
        return { key };
    } catch (error) {
        console.log("Error uploading to S3:", error);
        return { error };
    }
}

/**
 * Returns all object keys in S3 starting with a given userId prefix.
 */
export async function getImagesKeysByUser(
    userId: string
): Promise<string[] | { error: unknown }> {
    const command = new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: userId,
    });

    try {
        const { Contents = [] } = await s3.send(command);

        // Filter out undefined keys
        const keys: string[] = Contents.flatMap((item) =>
            item.Key ? [item.Key] : []
        );

        return keys;
    } catch (error) {
        console.log("Error listing objects:", error);
        return { error };
    }
}

/**
 * Discriminated union type for return from `getUserSignedUrl`.
 * We always return an object (never a raw array), so the controller can destructure safely.
 */
interface SignedUrlObject {
    key: string;
    signedUrl: string;
}

type GetUserSignedUrlResult =
    | { preSignedUrls: SignedUrlObject[]; error?: undefined }
    | { preSignedUrls?: undefined; error: unknown };

/**
 * Get signed URLs for all images that belong to a user.
 * In success case, we return `{ preSignedUrls: string[] }`.
 * If there's an error, we return `{ error: unknown }`.
 */
export async function getUserSignedUrl(
    userId: string
): Promise<GetUserSignedUrlResult> {
    const imageKeys = await getImagesKeysByUser(userId);
    if ("error" in imageKeys) {
        return { error: imageKeys.error };
    }

    try {
        const preSignedUrls = await Promise.all(
            imageKeys.map(async (key) => {
                const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
                const url = await getSignedUrl(s3, command, { expiresIn: 1800 });
                return { key, signedUrl: url };
            })
        );
        return { preSignedUrls };
    } catch (error) {
        console.log("Error getting signed URL:", error);
        return { error };
    }
}

/**
 * Removes an image from S3 by key
 */
export async function removeImageFromS3(
    key: string
): Promise<{ success: boolean; error?: unknown }> {
    const command = new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: key,
    });

    try {
        const res = await s3.send(command);
        console.log(res)
        return { success: true };
    } catch (error) {
        console.log("Error deleting from S3:", error);
        return { success: false, error };
    }
}
