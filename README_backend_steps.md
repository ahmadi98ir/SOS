# مستند گام‌به‌گام توسعه بخش احراز هویت و اعلان‌ها (Next.js + Prisma + PostgreSQL)

این فایل در هر مرحله، اقدامات انجام‌شده را به صورت خلاصه و شفاف ثبت می‌کند.

---

## گام ۱: راه‌اندازی دیتابیس و Prisma
- ایجاد دیتابیس PostgreSQL با نام `moto_emergency_db`.
- ساخت فایل `prisma/schema.prisma` با مدل‌های User، Session، Notification.
- نصب و راه‌اندازی Prisma و اجرای migrate اولیه.
- ساخت فایل `.env` و تنظیم connection string.

## گام ۲: پیاده‌سازی ثبت‌نام و ورود واقعی
- مهاجرت endpoint ثبت‌نام (`/api/register`) به Prisma/PostgreSQL و رمزنگاری رمز با bcrypt.
- مهاجرت endpoint ورود (`/api/login`) به Prisma/PostgreSQL و صدور JWT واقعی.
- ذخیره refresh token در جدول Session.

## گام ۳: مدیریت نشست و توکن
- پیاده‌سازی endpoint `/api/refresh` برای صدور مجدد access token با اعتبارسنجی refresh token و JWT.
- حذف کامل منطق in-memory و استفاده فقط از دیتابیس.

## گام ۴: تغییر رمز عبور و ویرایش پروفایل
- مهاجرت کامل endpoint تغییر رمز عبور (`/api/change-password`) به Prisma و حذف sessionهای کاربر پس از تغییر رمز.
- مهاجرت endpoint ویرایش نام کاربری (`/api/edit-profile`) به Prisma و کنترل یکتا بودن نام کاربری جدید.
- بروزرسانی فرم‌ها برای ارسال userId و هماهنگی با backend جدید.

## گام ۵: اعلان‌های واقعی (Notifications)
- ساخت جدول اعلان‌ها و پیاده‌سازی endpoint `/api/notifications` برای دریافت و علامت‌گذاری اعلان‌ها.
- بروزرسانی NotificationsPanel برای دریافت داده از سرور.

## گام ۶: افزودن اعلان جدید توسط ادمین/تست
- پیاده‌سازی endpoint `/api/admin-add-notification` برای افزودن اعلان جدید برای یک کاربر یا همه کاربران.
- قابلیت ارسال اعلان سیستمی، اضطراری یا سفارشی برای کاربران.

## گام ۷: یکپارچه‌سازی داشبورد (Dashboard Integration)
- افزودن کامپوننت `AdminAddNotificationForm` و `NotificationsPanel` به صفحه داشبورد (dashboard/page.tsx) برای تست/ادمین.
- نمایش بخش اعلان‌ها و فرم افزودن اعلان به صورت جداگانه و با طراحی راست‌چین و فارسی.

## گام ۸: اعلان بلادرنگ (Real-time Notification)
- ایجاد سرور WebSocket ساده با فایل `ws-server.js` در ریشه پروژه.
- استفاده از پکیج ws (نصب با npm install ws).
- سرور WebSocket روی پورت 3001 و HTTP endpoint برای ارسال اعلان به کلاینت‌ها روی پورت 3002 (`/notify`).
- هر اعلان جدید از طریق HTTP POST به `/notify`، به همه کلاینت‌های WebSocket ارسال می‌شود.
- آماده‌سازی برای اتصال کلاینت Next.js و نمایش اعلان زنده.

---

> این مستند در هر مرحله با توضیح دقیق تغییرات و اقدامات توسعه به‌روزرسانی خواهد شد.
