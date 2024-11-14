import { PrismaClient } from "@prisma/client";
import {
  ValidationError,
  NotFoundError,
  InternalServerError,
} from "../error.js";

const prisma = new PrismaClient();

/*TODO
 * createProduct에 이미지처리 추가하기
 */
export const createProduct = async (req, res) => {
  const { name, description, price, tags } = req.body;
  if (!name || !description || !price || !tags) {
    throw new ValidationError("모든 필드를 입력해주세요.");
  }

  const product = await prisma.product.create({
    data: { name, description, price, tags },
  });
  res.status(201).send(product);
};

//상품 조회
export const getProduct = async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id },
  });
  if (!product) {
    throw new NotFoundError("상품이 없습니다.");
  }
  res.status(200).send(product);
};

// 상품 목록 조회

export const getProductList = async (req, res) => {
  const { page = 1, limit = 10, sort = "recent", search } = req.query;

  //정렬
  const sortOption =
    sort === "recent" ? { createdAt: "desc" } : { createdAt: "asc" }; //-1은 내림차순 정렬(시간은 큰 값 -> 작은 값)

  // 페이지네이션
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const searchCondition = search
    ? {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      }
    : {};

  // 상품 목록 조회
  const products = await prisma.product.findMany({
    where: searchCondition,
    skip: offset,
    take: parseInt(limit),
    orderBy: sortOption,
  });

  // 총 상품 개수 조회
  const totalProducts = await prisma.product.count({
    where: searchCondition,
  });

  res.status(200).send({
    totalProducts,
    page: parseInt(page),
    totalPages: Math.ceil(totalProducts / parseInt(limit)),
    products,
  });
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, tags } = req.body;
  const updatedProduct = await prisma.product.update({
    where: { id },
    data: { name, description, price, tags, updatedAt: new Date() },
  });

  if (!updatedProduct) {
    throw new NotFoundError("상품을 찾을 수 없습니다.");
  }

  res.status(200).send(updatedProduct);
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.delete({
    where: { id },
  });
  if (!product) {
    throw new NotFoundError("상품이 없습니다.");
  }
  res.status(200).send({ message: "상품이 삭제되었습니다.", product });
};
