import { PrismaClient } from "@prisma/client";
import {
  ValidationError,
  NotFoundError,
  InternalServerError,
} from "../error.js";

const prisma = new PrismaClient();

export const createComment = async (req, res) => {
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
};

export const getComment = async (req, res) => {
  const { articleId } = req.params;
  const comment = await prisma.comment.findMany({
    where: { articleId },
  });

  res.status(200).send(comment);
};

export const updateComment = async (req, res) => {
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
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  const comment = await prisma.comment.delete({
    where: { id },
  });

  res.status(200).send({ message: "댓글이 삭제되었습니다.", comment });
};
