import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const isBranchOrDriver = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] ?? "";

    if (!token) {
      return res.status(401).json({ message: "Invalid token" });
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
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default isBranchOrDriver;
