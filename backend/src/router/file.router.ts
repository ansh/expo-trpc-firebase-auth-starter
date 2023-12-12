import { firebaseApp } from "../config/firebase";
import express from "express";
import { uploadToFirebase } from "../services/file.service";

/**
 * Express router for handling file routes.
 */
const fileRouter = express.Router();

// Endpoint for uploading blob image files
fileRouter.post("/upload", async (req, res) => {
  const extension = req.query.extension;
  let data: any[] = [];

  req.on("data", chunk => {
    data.push(chunk);
  });

  req.on("end", async () => {
    let buffer = Buffer.concat(data);
    try {
      const fileUrl = await uploadToFirebase(buffer, extension as string);
      return res.send(fileUrl);
    } catch (error) {
      console.error("Error uploading to Firebase:", error);
      return res.status(500).send("Error uploading file");
    }
  });
});

export default fileRouter;
