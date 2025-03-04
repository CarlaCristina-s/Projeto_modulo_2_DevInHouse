import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const isAdminOrDriver = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(" ")[1] ?? "";

    if (!token) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET ?? "") as any;

    const role = (<any>payload).role;
    const userId = (<any>payload).userId;
    const { id } = req.params;

    const isAdmin = role === "ADMIN";
    const isDriver = role === "DRIVER";

    if (isAdmin) {
      next();
    } else if (isDriver) {
      if (userId == id) {
        next();
      } else {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
    } else {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};

export default isAdminOrDriver;
