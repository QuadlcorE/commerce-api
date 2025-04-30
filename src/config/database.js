import mongoose from "mongoose";
import { config } from "dotenv";

config();

export function connect() {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => console.log("MongoDB connected successfully!")).catch((err) => {
        console.log("MongoDB connection failed!");
        console.log(err);
        process.exit(1);
    })
}