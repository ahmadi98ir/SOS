import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
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
function generateRefreshToken(user: { id: string }) {
  return jwt.sign(
    { userId: user.id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "متد مجاز نیست." });
  }
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "نام کاربری و رمز عبور الزامی است." });
  }
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "نام کاربری یا رمز عبور اشتباه است." });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "نام کاربری یا رمز عبور اشتباه است." });
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const now = new Date();
    const accessTokenExpires = new Date(now.getTime() + 15 * 60 * 1000);
    const refreshTokenExpires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    await prisma.session.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: refreshTokenExpires,
      },
    });
    return res.status(200).json({
      accessToken,
      accessTokenExpires: accessTokenExpires.getTime(),
      refreshToken,
      refreshTokenExpires: refreshTokenExpires.getTime(),
      userId: user.id,
      username: user.username,
      role: user.role,
    });
  } catch (e) {
    return res.status(500).json({ message: "خطای سرور. دوباره تلاش کنید." });
  }
}
