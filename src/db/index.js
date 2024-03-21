import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );
    console.log(
      `Database connection success: ${(await connectionInstance).connection.host}`
    );
  } catch (error) {
    console.log(`Database connection failed : ${error} `);
    process.exit(1);
  }
};

export default connectDB;
