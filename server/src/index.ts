import "dotenv/config";
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import connectToDb from "./config/db";
import errorHandler from "./middleware/errorHandler";
import { APP_ORIGIN, PORT } from "./constants/env";
import { OK } from "./constants/http";
import authRoute from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import authenticate from "./middleware/authenticate";
import sessionsRoute from "./routes/sessions.route";
import uploadRoute from "./routes/upload.route";

const app = express();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: APP_ORIGIN, credentials: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    return res.status(OK).json({ status: "Success" });
});

app.use("/auth", authRoute);

app.use("/user", authenticate, userRoutes);
app.use("/upload/images", authenticate, uploadRoute);

app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await connectToDb();
});
