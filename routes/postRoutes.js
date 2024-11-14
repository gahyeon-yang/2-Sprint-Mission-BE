import express from "express";
import {
  createArticle,
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
} from "../controller/postController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

// 게시글 등록 API
router.post("/", asyncHandler(createArticle));

// 게시글 목록 조회 API
router.get("/", asyncHandler(getArticles));

// 게시글 조회 API
router.get("/:id", asyncHandler(getArticle));

// 게시글 수정 API
router.patch("/:id", asyncHandler(updateArticle));

// 게시글 삭제 API
router.delete("/:id", asyncHandler(deleteArticle));

export default router;
