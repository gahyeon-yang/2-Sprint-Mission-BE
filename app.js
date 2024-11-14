import express from "express";
import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import {
  ValidationError,
  NotFoundError,
  InternalServerError,
} from "./error.js";
import productRouter from "./routes/productRoutes.js";
import postRouter from "./routes/postRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import cors from "cors";

dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(cors());

app.use(express.json());

//에러 처리
function asyncHandler(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (e) {
      if (!(e instanceof ValidationError) && !(e instanceof NotFoundError)) {
        // 400 404 아닌 경우 500으로 취급
        e = new InternalServerError(e.message);
      }
      next(e);
    }
  };
}

// 전역 에러 핸들러

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({ message: err.message });
});

//인증 미들웨어

//상품
const productRouter = express.Router();

//상품 상세 조회 API (get)

productRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {})
);

//상품 수정 API (PATCH)

productRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {})
);

//상품 삭제 API

productRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {})
);

app.use("/products", productRouter);

//게시글

const postRouter = express.Router();

postRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    //등록
    const { title, content } = req.body;
    if (!title || !content) {
      throw new ValidationError("모든 필드 입력해주세요");
    }
    const article = await prisma.article.create({
      data: {
        title,
        content,
      },
    });

    res.status(201).send(article);
  })
);

postRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    // 모든 게시글 조회
    const articles = await prisma.article.findMany(); // 모든 게시글 가져오기
    res.status(200).send(articles);
  })
);

postRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    //조회
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      throw new NotFoundError("게시글이 없습니다.");
    }

    res.status(200).send(article);
  })
);

postRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    //수정
    const { title, content } = req.body;
    const { id } = req.params;

    const updateArticle = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        updatedAt: new Date(),
      },
    });

    if (!updateArticle) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }

    res.status(200).send(updateArticle);
  })
);

postRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.article.delete({
      where: { id },
    });

    res.status(200).send({ message: "게시글이 삭제되었습니다.", article });
  })
);
app.use("/articles", postRouter);

//댓글
const commentRouter = express.Router({ mergeParams: true });

commentRouter.post(
  //등록
  "/",
  asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { articleId } = req.params;

    if (!content) {
      throw new ValidationError("댓글을 입력해주세요.");
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        articleId,
      },
    });

    res.status(201).send(comment);
  })
);

// 수정
commentRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { id } = req.params;

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        content,
        updatedAt: new Date(),
      },
    });

    if (!updatedComment) {
      throw new NotFoundError("댓글을 찾을 수 없습니다.");
    }

    res.status(200).send(updatedComment);
  })
);

// 삭제
commentRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const comment = await prisma.comment.delete({
      where: { id },
    });

    res.status(200).send({ message: "댓글이 삭제되었습니다.", comment });
  })
);

// 조회
commentRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { articleId } = req.params;
    const comment = await prisma.comment.findMany({
      where: { articleId },
    });

    res.status(200).send(comment);
  })
);

app.use("/articles/:articleId/comments", commentRouter);
app.listen(process.env.PORT || 4000, () => console.log("Server Started")); //서버 시작
