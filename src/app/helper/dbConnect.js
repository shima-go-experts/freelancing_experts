import mongoose from "mongoose";

const MONGO_DB_URL = process.env.MONGO_DB_URL;
// console.log("segdbvhn",MONGO_DB_URL);

if (!MONGO_DB_URL) {
  throw new Error("❌ Please add your MONGODB_URI to .env");
}

let isConnected = false; // Track the connection status

export const dbConnect = async () => {
  if (isConnected) {
    console.log("🟢 MongoDB already connected");
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_DB_URL, {
      dbName: "freelancerAdmin",
    });

    isConnected = db.connections[0].readyState;
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw new Error("MongoDB connection failed");
  }
};
export default dbConnect;