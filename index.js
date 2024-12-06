// Menampilkan nilai DATABASE_URL di console untuk debugging
console.log("DATABASE_URL:", process.env.DATABASE_URL);

// Import express, multer, path, dan prisma
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const prisma = require("./prisma/client"); // Pastikan prisma client sudah benar di-import

// Setup storage engine untuk multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images"); // Tempat penyimpanan gambar
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Menggunakan timestamp untuk nama file
  },
});

const upload = multer({ storage });

// Inisialisasi Express app
const app = express();

// Gunakan middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Menyajikan folder public untuk gambar
app.use("/images", express.static("public/images")); // Perbaiki URL path untuk akses gambar

// Route untuk menerima artikel dan gambar
app.post("/api/articles", upload.single("image"), async (req, res) => {
  const { title, content } = req.body;
  const image = req.file ? `/images/${req.file.filename}` : null;

  try {
    // Simpan artikel ke database menggunakan Prisma
    const article = await prisma.article.create({
      data: {
        title,
        content,
        image, // Menyimpan path gambar
      },
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route utama
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Route untuk artikel
const router = require("./routes/articleRoutes");
app.use("/api", router);

// Menjalankan server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
