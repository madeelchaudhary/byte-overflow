import mongoose, { connect } from "mongoose";

declare global {
  var db: {
    promise: ReturnType<typeof connect> | null;
    conn: typeof mongoose | null;
  };
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.db;

if (!cached) {
  cached = global.db = { conn: null, promise: null };
}

const dbConnect = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  const opts = {
    dbName: "devflow",
  };

  mongoose.set("strictQuery", true);
  cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
    return mongoose;
  });

  try {
    cached.conn = await cached.promise;
    console.log("Connected to mongodb");
  } catch (error) {
    cached.promise = null;
    console.error("Error connecting to mongodb", error);
  }

  return cached.conn;
};

export default dbConnect;
