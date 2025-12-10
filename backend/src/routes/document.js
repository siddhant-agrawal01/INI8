import express from "express";
import {
  uploadDocument,
  downloadDocument,
  deleteDocument,
  getAllDocuments,
} from "../controllers/document.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadDocument);
router.get("/", getAllDocuments);
router.get("/:id", downloadDocument);
router.delete("/:id", deleteDocument);

export default router;
