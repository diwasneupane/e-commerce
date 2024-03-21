import { app } from "./app.js";
import connectDB from "./db/index.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`PORT is running at : ${process.env.PORT} `);
    });
  })
  .catch((error) => {
    console.log(`Error while connecting to database:${error}`);
  });
