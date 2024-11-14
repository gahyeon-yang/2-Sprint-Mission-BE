import express from "express";
import {
  createComment,
  updateComment,
  deleteComment,
  getComment,
} from "../controller/commentController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

// 댓글 등록 API
router.post("/", asyncHandler(createComment));

// 댓글 수정 API
router.patch("/:id", asyncHandler(updateComment));

// 댓글 삭제 API
router.delete("/:id", asyncHandler(deleteComment));

// 댓글 조회 API
router.get("/", asyncHandler(getComment));

export default router;
