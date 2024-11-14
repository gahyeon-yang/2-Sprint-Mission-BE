import express from "express";
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductList,
} from "../controller/productController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

// 상품 등록 API
router.post("/", asyncHandler(createProduct));

// 상품 조회 API
router.get("/:id", asyncHandler(getProduct));

// 상품 목록 조회 API
router.get("/", asyncHandler(getProductList));

// 상품 수정 API
router.patch("/:id", asyncHandler(updateProduct));

// 상품 삭제 API
router.delete("/:id", asyncHandler(deleteProduct));

export default router;
