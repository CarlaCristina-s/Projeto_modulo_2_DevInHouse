import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const isBranchOrDriver = (
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

    const isBranch = role === "BRANCH";
    const isDriver = role === "DRIVER";

    if (isBranch) {
      next();
    } else if (isDriver) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};

export default isBranchOrDriver;
