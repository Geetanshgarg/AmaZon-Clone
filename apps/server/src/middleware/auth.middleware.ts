import { auth } from "@AmaZon-Clone/auth";
import type { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return res.status(401).json({ success: false, message: "Unauthorized - Please login to continue." });
    }

    // Attach user to the request
    (req as any).user = session.user;
    next();
  } catch (error) {
    next(error);
  }
};
