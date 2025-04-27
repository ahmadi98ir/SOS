import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "متد مجاز نیست." });
  }
  const { userId, currentPassword, newPassword } = req.body;
  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "همه فیلدها الزامی است." });
  }
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(401).json({ message: "کاربر یافت نشد." });
    }
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return res.status(400).json({ message: "رمز عبور فعلی اشتباه است." });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    // حذف همه sessionها (refresh token) برای امنیت بیشتر
    await prisma.session.deleteMany({ where: { userId } });
    return res.status(200).json({ message: "رمز عبور با موفقیت تغییر کرد. لطفاً دوباره وارد شوید." });
  } catch (e) {
    return res.status(500).json({ message: "خطای سرور. دوباره تلاش کنید." });
  }
}
