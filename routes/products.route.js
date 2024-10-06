import express from "express";
import multer from "multer";
import path from "path"

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  getProductByTitle,
  updateProduct,
  getCategories,
  createCategory,
  deleteCategory,
  getProductsByCategory
} from "../controllers/products.controller.js";


const router = express.Router();

router.get("/", getAllProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getProduct);
router.get("/search/:title", getProductByTitle);
router.delete("/:id", deleteProduct);

router.get("/categories/get", getCategories);
router.delete("/categories/:id", deleteCategory);
router.post("/categories", createCategory);
// create product

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,
});

router.post("/", upload.array("images", 1), createProduct);

//update Product

router.put("/:id", upload.array("images", 1),updateProduct);

export default router;