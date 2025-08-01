const express = require("express");
const {
  createCanvas,
  updateCanvas,
  loadCanvas,
  shareCanvas,
  unshareCanvas,
  deleteCanvas,
  getUserCanvases,
  updateCanvasName, // Added this
} = require("../controllers/canvasController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createCanvas);
router.put("/update", authMiddleware, updateCanvas);
router.get("/load/:id", authMiddleware, loadCanvas);
router.put("/share/:id", authMiddleware, shareCanvas);
router.put("/unshare/:id", authMiddleware, unshareCanvas);
router.delete("/delete/:id", authMiddleware, deleteCanvas);
router.get("/list", authMiddleware, getUserCanvases);
router.put("/update-name", authMiddleware, updateCanvasName); // New route

module.exports = router;
