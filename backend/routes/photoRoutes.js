import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";
import User from "../models/User.js";

const router = express.Router();
let gfs;

mongoose.connection.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "avatars",
  });
});

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `avatar_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.get("/:id", async (req, res) => {
  let fileId;
  try {
    fileId = new mongoose.Types.ObjectId(req.params.id);
  } catch {
    return res.status(400).json({ message: "Invalid file ID" });
  }

  try {
    const fileDoc = await gfs.find({ _id: fileId }).toArray();
    if (!fileDoc || fileDoc.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    const file = fileDoc[0];
    res.set("Content-Type", file.contentType);
    gfs.openDownloadStream(fileId).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", upload.single("avatar"), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");

  try {
    const userId = req.params.id;

    const readStream = fs.createReadStream(req.file.path);
    const uploadStream = gfs.openUploadStream(req.file.filename, {
      contentType: req.file.mimetype,
    });

    readStream.pipe(uploadStream)
      .on("error", (err) => {
        console.error("Upload error:", err);
        res.status(500).json({ message: "Upload failed" });
      })
      .on("finish", async () => {
        fs.unlinkSync(req.file.path);

        await User.findByIdAndUpdate(userId, {
          avatar: true,
        });

        res.json({ message: "Avatar uploaded successfully" });
      });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});


export default router;
