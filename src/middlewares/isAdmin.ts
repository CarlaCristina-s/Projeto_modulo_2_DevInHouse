import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(" ")[1] ?? "";

    if (!token) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET ?? "") as any;
    const role = (<any>payload).role;

    const isAdmin = role === "ADMIN";

    if (!isAdmin) {
      res.status(403).json({
        message: "User must be admin",
      });
      return;
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};

export default isAdmin;
