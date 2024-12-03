// Import express-validator
const { body } = require("express-validator");

// Import prisma
const prisma = require("../../prisma/client");

// Definisikan validasi untuk menambah artikel
const validateCreateArticle = [
  body("title")
    .notEmpty()
    .withMessage("Title is required") // Pastikan judul tidak kosong
    .isLength({ max: 255 })
    .withMessage("Title must be at most 255 characters long"), // Pastikan judul tidak lebih dari 255 karakter

  body("content").notEmpty().withMessage("Content is required"), // Pastikan konten tidak kosong

  body("image")
    .optional() // Gambar bersifat opsional
    .isURL()
    .withMessage("Image URL must be valid"), // Jika ada, pastikan URL gambar valid
];

// Definisikan validasi untuk memperbarui artikel
const validateUpdateArticle = [
  body("title")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Title must be at most 255 characters long"), // Validasi opsional jika judul ada

  body("content").optional().notEmpty().withMessage("Content cannot be empty"), // Validasi opsional jika konten ada

  body("image").optional().isURL().withMessage("Image URL must be valid"), // Validasi opsional jika gambar ada
];

// Definisikan validasi untuk artikel yang dihapus (tidak perlu banyak validasi)
const validateDeleteArticle = [
  body("id").isInt().withMessage("Article ID must be a number"), // Pastikan ID artikel adalah angka
];

module.exports = {
  validateCreateArticle,
  validateUpdateArticle,
  validateDeleteArticle,
};
