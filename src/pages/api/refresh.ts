import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret_dev";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret_dev";

function generateAccessToken(user: { id: string; username: string; role: string }) {
  return jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "متد مجاز نیست." });
  }
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: "رفرش توکن الزامی است." });
  }
  try {
    // Validate refresh token
    let payload: any;
    try {
      payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    } catch {
      return res.status(401).json({ message: "رفرش توکن نامعتبر یا منقضی شده است." });
    }
    // Check if token exists in DB and not expired
    const session = await prisma.session.findUnique({ where: { token: refreshToken } });
    if (!session || session.expiresAt.getTime() < Date.now()) {
      return res.status(401).json({ message: "رفرش توکن نامعتبر یا منقضی شده است." });
    }
    // Get user
    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) {
      return res.status(401).json({ message: "کاربر یافت نشد." });
    }
    // Generate new access token
    const accessToken = generateAccessToken(user);
    const accessTokenExpires = Date.now() + 15 * 60 * 1000;
    return res.status(200).json({
      accessToken,
      accessTokenExpires,
      userId: user.id,
      username: user.username,
      role: user.role,
    });
  } catch (e) {
    return res.status(500).json({ message: "خطای سرور. دوباره تلاش کنید." });
  }
}
