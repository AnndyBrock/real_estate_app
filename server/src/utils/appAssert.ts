import assert from "node:assert";
import appError from "./AppError";
import { HttpStatusCode } from "../constants/http";
import AppErrorCode from "../constants/appErrorCode";

type AppAssert = <T>(
    condition: T,
    httpStatusCode: HttpStatusCode,
    message: string,
    appErrorCode?: AppErrorCode
) => asserts condition;

/**
 * Assert a condition and throw an AppError if the condition is falsy.
 */
const appAssert: AppAssert = (
    condition,
    httpStatusCode,
    message,
    appErrorCode
) => assert(condition, new appError(httpStatusCode, message, appErrorCode));

export default appAssert;
