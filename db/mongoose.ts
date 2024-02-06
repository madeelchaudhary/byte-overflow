import mongoose from "mongoose";

let connection: typeof mongoose;

export const connect = async () => {
  if (connection) {
    return connection;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  try {
    mongoose.set("strictQuery", true);
    connection = await mongoose.connect(uri, {
      dbName: "devflow",
    });

    console.log("Connected to mongodb");
    return connection;
  } catch (error) {
    console.error("Error connecting to mongodb", error);
  }
};
