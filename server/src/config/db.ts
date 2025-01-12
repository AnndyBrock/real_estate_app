import * as mongoose from "mongoose";
import { DATABASE_URL } from "../constants/env";

const connectToDb = async () => {
    try {
        await mongoose.connect(DATABASE_URL);
        console.log("Successfully connected to database");
    } catch (error) {
        console.log("Could not connect to DB " + error);
        process.exit(1);
    }
};

export default connectToDb;
