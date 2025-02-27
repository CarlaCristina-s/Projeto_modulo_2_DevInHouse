require("dotenv").config();

import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";

import cors from "cors";

import userRouter from "./routes/user.routes";
import loginRouter from "./routes/login.routes";
import productRouter from "./routes/product.routes";

import { handleError } from "./middlewares/handleError";

import authRouter from "./routes/auth.routes";
import logger from "./config/winston";

const app = express();

app.use(cors()); // Permite que o express entenda requisições de outros domínios

app.use(express.json()); // Permite que o express entenda JSON

app.use("/login", loginRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);


app.get("/env", (req, res) => {
  res.json({
    port: process.env.PORT,
    node_env: process.env.NODE_ENV,
  });
});

app.use(handleError);

AppDataSource.initialize()
  .then(() => {
    app.listen(process.env.PORT, () => {
      logger.info(
        `O servidor está rodando em http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((error) => console.log(error));
