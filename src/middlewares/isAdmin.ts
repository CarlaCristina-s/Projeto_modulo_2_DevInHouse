import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1] ?? "";
    
        if (!token) {
          return res.status(401).json({ message: "Invalid token" });
        }
    
        const payload = jwt.verify(token, process.env.JWT_SECRET ?? "") as any;
        const role = (<any>payload).role
    
        const isAdmin = role === "ADMIN";
    
        if (!isAdmin) {
          return res.status(403).json({
            message: "User must be admin",
          });
        }
    
        next();
      } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
      }
 
}

export default isAdmin;