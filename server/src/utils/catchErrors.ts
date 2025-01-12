import { NextFunction, Request, Response } from "express";

type AsyncController = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const catchErrors =
    (controller: AsyncController): AsyncController =>
        async (req, res, next) => {
            try {
                await controller(req, res, next);
            } catch (error) {
                // pass error on
                next(error);
            }
        };

export default catchErrors;
