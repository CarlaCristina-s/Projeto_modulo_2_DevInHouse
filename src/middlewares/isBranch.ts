import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

type dataJwt = JwtPayload & { userId: string };

export const isBranch = (
  req: Request & { userId: string },
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] ?? "";

    if (!token) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const data = jwt.verify(token, process.env.JWT_SECRET ?? "") as dataJwt;

    const isBranch = data.role === "BRANCH";

    if (!isBranch) {
      return res.status(403).json({
        message: "User must be branch to access this route",
      });
    }

    req.userId = data.userId;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default isBranch;
