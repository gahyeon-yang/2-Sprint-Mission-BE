import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import productRouter from "./routes/productRoutes.js";
import postRouter from "./routes/postRoutes.js";
import commentRouter from "./routes/commentRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/products", productRouter);
app.use("/articles", postRouter);
app.use("/articles/:articleId/comments", commentRouter);

app.listen(process.env.PORT || 4000, () => console.log("Server Started")); //서버 시작
