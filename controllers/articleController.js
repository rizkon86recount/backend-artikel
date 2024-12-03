const prisma = require("../prisma/client");

// Fungsi untuk membuat artikel
const createArticle = async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : null; // Mendapatkan path gambar

    // Simpan artikel ke dalam database
    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        image, // Menyimpan path gambar
      },
    });

    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ error: "Failed to create article" });
  }
};

// Fungsi untuk mendapatkan semua artikel
const getAllArticles = async (req, res) => {
  try {
    const articles = await prisma.article.findMany();
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch articles" });
  }
};

// Fungsi untuk memperbarui artikel
const updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const image = req.file ? `/images/${req.file.filename}` : null; // Menangani gambar jika ada

  try {
    const updatedArticle = await prisma.article.update({
      where: { id: Number(id) },
      data: { title, content, image }, // Menyimpan path gambar yang baru jika di-update
    });
    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(500).json({ error: "Failed to update article" });
  }
};

// Fungsi untuk menghapus artikel
const deleteArticle = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.article.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete article" });
  }
};

module.exports = {
  createArticle,
  getAllArticles,
  updateArticle,
  deleteArticle,
};
