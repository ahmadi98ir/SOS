import type { NextApiRequest, NextApiResponse } from "next";
import { tokens } from "./authStore";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: "رفرش توکن الزامی است." });
  }
  const idx = tokens.findIndex((t) => t.refreshToken === refreshToken);
  if (idx === -1) {
    return res.status(200).json({ message: "کاربر قبلاً خارج شده یا توکن نامعتبر است." });
  }
  tokens.splice(idx, 1);
  return res.status(200).json({ message: "خروج موفقیت‌آمیز انجام شد." });
}
