import mongoose from "mongoose";

import { app } from "../app";

const conectarNoBD = async () => {
  try {
    const prod =
      "mongodb+srv://gabrielsouza:8b2oG6suHox7bijM@cluster0.r9ihj.mongodb.net/portalmax";

    await mongoose.connect(prod);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB error: ", error);
    process.exit(1);
  }
};

export default conectarNoBD;
