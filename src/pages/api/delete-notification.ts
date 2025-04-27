import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "متد مجاز نیست." });
  }
  const { notificationId, userId } = req.body;
  if (!notificationId || !userId) {
    return res.status(400).json({ message: "شناسه اعلان و کاربر الزامی است." });
  }
  try {
    const notif = await prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notif || notif.userId !== userId) {
      return res.status(404).json({ message: "اعلان یافت نشد یا مجاز نیست." });
    }
    await prisma.notification.delete({ where: { id: notificationId } });
    return res.status(200).json({ message: "اعلان حذف شد." });
  } catch {
    return res.status(500).json({ message: "خطا در حذف اعلان." });
  }
}
