import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createArticle = async (req, res) => {
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
};

export const getArticles = async (req, res) => {
  const articles = await prisma.article.findMany();
  res.status(200).send(articles);
};

export const getArticle = async (req, res) => {
  const { id } = req.params;

  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    throw new NotFoundError("게시글이 없습니다.");
  }

  res.status(200).send(article);
};

export const updateArticle = async (req, res) => {
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
};

export const deleteArticle = async (req, res) => {
  const { id } = req.params;
  const article = await prisma.article.delete({
    where: { id },
  });

  res.status(200).send({ message: "게시글이 삭제되었습니다.", article });
};
