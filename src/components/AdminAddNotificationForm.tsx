import React, { useState } from "react";

export const AdminAddNotificationForm: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const res = await fetch("/api/admin-add-notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userId || "all", message, type }),
    });
    const data = await res.json();
    setResult(data.message);
    setLoading(false);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded p-4 w-full max-w-lg mx-auto mt-6 flex flex-col gap-4 rtl">
      <h2 className="font-bold text-lg text-center">افزودن اعلان جدید (ادمین/تست)</h2>
      <div>
        <label className="block mb-1">شناسه کاربر (برای همه: خالی بگذارید)</label>
        <input
          className="border rounded w-full px-2 py-1"
          value={userId}
          onChange={e => setUserId(e.target.value)}
          placeholder="userId یا خالی برای همه"
        />
      </div>
      <div>
        <label className="block mb-1">متن اعلان</label>
        <input
          className="border rounded w-full px-2 py-1"
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1">نوع اعلان</label>
        <select className="border rounded w-full px-2 py-1" value={type} onChange={e => setType(e.target.value)}>
          <option value="info">اطلاع‌رسانی</option>
          <option value="success">موفقیت</option>
          <option value="error">خطا/هشدار</option>
        </select>
      </div>
      <button
        className="bg-blue-600 text-white rounded py-2 disabled:opacity-50"
        type="submit"
        disabled={loading || !message}
      >
        {loading ? "در حال ارسال..." : "ارسال اعلان"}
      </button>
      {result && <div className="text-center text-green-600 mt-2">{result}</div>}
    </form>
  );
};
