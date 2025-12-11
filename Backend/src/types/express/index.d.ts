import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      admin?: JwtPayload | any;
      user?: JwtPayload | any;
    }
  }
}

export {};
