const express = require("express");
const multer = require("multer");
const path = require("path");
const prisma = require("../prisma/client"); // Pastikan ini ada
const router = express.Router();
const {
  createArticle,
  getAllArticles,
  updateArticle,
  deleteArticle,
} = require("../controllers/articleController");

// Setup multer untuk menangani gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images"); // Tempat penyimpanan gambar
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Menggunakan timestamp untuk nama file
  },
});

const upload = multer({ storage });

// Route untuk mendapatkan artikel berdasarkan ID
router.get("/articles/:id", async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const article = await prisma.article.findUnique({
      where: { id: Number(id) },
    });

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json(article); // Kembalikan artikel dalam format JSON
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: "Failed to fetch article" });
  }
});

// Route untuk menambahkan artikel
router.post("/articles", upload.single("image"), createArticle);

// Route untuk mendapatkan semua artikel
router.get("/articles", getAllArticles);

// Route untuk memperbarui artikel
router.put("/articles/:id", upload.single("image"), updateArticle);

// Route untuk menghapus artikel
router.delete("/articles/:id", deleteArticle);

module.exports = router;
