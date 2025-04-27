import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

// فقط برای تست/ادمین: ایجاد اعلان جدید برای یک کاربر یا همه کاربران
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "متد مجاز نیست." });
  }
  const { userId, message, type } = req.body;
  if (!message || !type) {
    return res.status(400).json({ message: "پیام و نوع اعلان الزامی است." });
  }
  try {
    if (userId === "all") {
      // اعلان برای همه کاربران
      const users = await prisma.user.findMany({ select: { id: true } });
      await prisma.$transaction(
        users.map((u) =>
          prisma.notification.create({
            data: {
              userId: u.id,
              message,
              type,
            },
          })
        )
      );
      // ارسال اعلان بلادرنگ به همه
      try {
        await fetch("http://localhost:3002/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: "all", message, type }),
        });
      } catch (e) {
        console.log("ws-server is not available for broadcast");
      }
      return res.status(201).json({ message: "اعلان برای همه کاربران ارسال شد." });
    } else {
      // اعلان برای کاربر خاص
      await prisma.notification.create({
        data: {
          userId,
          message,
          type,
        },
      });
      // ارسال اعلان بلادرنگ به کاربر خاص
      try {
        await fetch("http://localhost:3002/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, message, type }),
        });
      } catch (e) {
        console.log("ws-server is not available for broadcast");
      }
      return res.status(201).json({ message: "اعلان ارسال شد." });
    }
  } catch {
    return res.status(500).json({ message: "خطا در ارسال اعلان." });
  }
}
