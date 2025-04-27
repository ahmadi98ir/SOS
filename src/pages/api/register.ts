import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "متد مجاز نیست." });
  }
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "نام کاربری و رمز عبور الزامی است." });
  }
  try {
    const exists = await prisma.user.findUnique({ where: { username } });
    if (exists) {
      return res.status(400).json({ message: "این نام کاربری قبلاً ثبت شده است." });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashed,
        role: "user"
      },
      select: { id: true, username: true }
    });
    return res.status(201).json(user);
  } catch (e) {
    return res.status(500).json({ message: "خطای سرور. دوباره تلاش کنید." });
  }
}
