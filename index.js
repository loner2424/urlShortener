const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const base62 = require("base62")
require("dotenv").config()

const app = express();
const PORT = 8001;

connectToMongoDB(process.env.MONGO_URI).then(() =>
  console.log("Mongodb connected")
);

app.use(express.json());

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
    
  );
  const newurl = entry.redirectURL.toString()
  res.send({"redirectURL":newurl});
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
