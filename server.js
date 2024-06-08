import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors"; // this middleware is to prevent the browser from eforcing security restrictions (Same Origin Policy)

dotenv.config(); //loads encrypted log in credentials from the .env file.

const app = express();
const port = process.env.PORT || 3000; //port to load the node.js

app.use(cors()); //this enables CORS  for all routes.

app.get("/api/data", async (_, res) => {
  console.log("hello");
  try {
    const response = await axios.get(process.env.API_KEY, {
      auth: {
        username: process.env.API_USERNAME,
        password: process.env.API_PASSWORD,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
