import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.method === "GET" ? req.query : req.body;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ message: "شناسه کاربر الزامی است." });
  }

  if (req.method === "GET") {
    // واکشی اعلان‌ها
    try {
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
      return res.status(200).json({ notifications });
    } catch {
      return res.status(500).json({ message: "خطا در واکشی اعلان‌ها." });
    }
  } else if (req.method === "POST") {
    // علامت‌گذاری به عنوان خوانده‌شده
    const { notificationId } = req.body;
    if (!notificationId) {
      return res.status(400).json({ message: "شناسه اعلان الزامی است." });
    }
    try {
      await prisma.notification.update({ where: { id: notificationId }, data: { read: true } });
      return res.status(200).json({ message: "اعلان به عنوان خوانده‌شده علامت‌گذاری شد." });
    } catch {
      return res.status(500).json({ message: "خطا در بروزرسانی اعلان." });
    }
  } else {
    return res.status(405).json({ message: "متد مجاز نیست." });
  }
}
