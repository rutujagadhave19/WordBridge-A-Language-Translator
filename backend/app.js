import express from "express";
const app = express();
import cors from "cors";
import fetch from "node-fetch";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const _dirname=path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.static(path.join(_dirname,"/frontend/dist")));


app.post("/", async (req, res) => {
  try {

    const { source, target, text } = req.body;
    if (!text) {
      return res.status(400).json({
        message: "Please enter the text",
        success: false,
      });
    }


    const url = `https://api.mymemory.translated.net/get?q=${text}&langpair=${source}|${target}`;

    const response = await fetch(url);
    if (!response) {
      return res.status(400).json({
        message: "Something went Wrong",
        success: false,
      });
    }

    const data = await response.json();
    if (!data) {
      return res.status(500).json({
        message: "Translation service error",
        success: false,
      });
    }

    return res.status(200).json({
      translatedText: data.responseData.translatedText,
      success: true,
    });
  } catch (error) {
    console.log("error in translate", error);
  }
});

app.get('*',(_,res)=>{
  res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"));
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server Running At Port ${port}`);
});
