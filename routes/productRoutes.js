import express from "express";
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductList,
} from "../controllers/productController.js";

const router = express.Router();

// 상품 등록 API
router.post("/", validateProduct, createProduct);

// 상품 조회 API
router.get("/:id", getProduct);

// 상품 목록 조회 API
router.get("/", getProductList);

// 상품 수정 API
router.patch("/:id", updateProduct);

// 상품 삭제 API
router.delete("/:id", deleteProduct);

export default router;
