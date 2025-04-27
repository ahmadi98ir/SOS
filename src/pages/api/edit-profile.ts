import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "متد مجاز نیست." });
  }
  const { userId, username } = req.body;
  if (!userId || !username || username.length < 3) {
    return res.status(400).json({ message: "نام کاربری باید حداقل ۳ کاراکتر باشد." });
  }
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(401).json({ message: "کاربر یافت نشد." });
    }
    // Check for duplicate username
    const duplicate = await prisma.user.findUnique({ where: { username } });
    if (duplicate && duplicate.id !== userId) {
      return res.status(400).json({ message: "این نام کاربری قبلاً ثبت شده است." });
    }
    await prisma.user.update({ where: { id: userId }, data: { username } });
    return res.status(200).json({ message: "نام کاربری با موفقیت ویرایش شد." });
  } catch (e) {
    return res.status(500).json({ message: "خطای سرور. دوباره تلاش کنید." });
  }
}
