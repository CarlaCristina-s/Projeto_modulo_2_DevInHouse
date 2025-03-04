import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

type dataJwt = JwtPayload & { userId: string };

const isDriver = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(" ")[1] ?? "";

    if (!token) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    const data = jwt.verify(token, process.env.JWT_SECRET ?? "") as dataJwt;

    const isDriver = data.role === "DRIVER";

    if (!isDriver) {
      res.status(403).json({
        message: "User must be driver to access this route",
      });
      return;
    }

    (req as any).userId = data.userId;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};

export default isDriver;
