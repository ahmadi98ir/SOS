# SOS
SOS

## اجرای تست‌های بخش اعلان و بک‌اند (Jest)

### ۱. نصب وابستگی‌های تست

در پوشه `frontend` این دستورات را اجرا کنید:

```bash
npm install --save-dev jest ts-jest @types/jest @types/node node-mocks-http
```

### ۲. اضافه کردن و بررسی پیکربندی Jest

یک فایل به نام `jest.config.js` با محتوای زیر باید وجود داشته باشد:

```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
```

### ۳. اجرای تست‌ها

در پوشه `frontend` دستور زیر را اجرا کنید:

```bash
npx jest
```
یا برای اجرای یک فایل تست خاص:
```bash
npx jest __tests__/notifications-api.test.ts
```

### ۴. نکات و رفع اشکال
- اگر پیغام "No tests found" دریافت کردید، مطمئن شوید فایل‌های تست شما با الگوی Jest (مانند `.test.ts`) نام‌گذاری شده‌اند و در مسیر `__tests__` یا ریشه پروژه قرار دارند.
- اگر تست‌ها اجرا نشدند، دستور `npx jest --passWithNoTests` را امتحان کنید تا خطا ندهد.
- اگر با خطای تایپ یا ایمپورت مواجه شدید، مطمئن شوید نسخه‌های پکیج‌ها با TypeScript و Node شما سازگار است.

### ۵. مستندسازی و توسعه
- برای افزودن تست جدید، فایل جدیدی با پسوند `.test.ts` در پوشه `__tests__` بسازید و تست‌های خود را بنویسید.
- می‌توانید از `node-mocks-http` برای شبیه‌سازی ریکوئست و ریسپانس Next.js API استفاده کنید.

---
