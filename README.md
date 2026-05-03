# 🚀 Hiretify - Nền tảng tuyển dụng kết nối sinh viên và doanh nghiệp


Hiretify là một nền tảng tuyển dụng toàn diện được thiết kế đặc biệt để kết nối sinh viên và các doanh nghiệp. Với giao diện được thiết kế tối giản và hiện đại, Hiretify mang đến trải nghiệm tìm việc và ứng tuyển mượt mà, chuyên nghiệp.

---

## ✨ Tính năng nổi bật

### 🎓 Dành cho Ứng viên (Sinh viên)
- **Tìm kiếm việc làm:** Lọc việc làm theo lĩnh vực,hình thức làm việc, tìm kiếm công việc theo từ khóa
- **Quản lý hồ sơ:** Tạo và cập nhật Profile chuyên nghiệp, tải lên CV.
- **Ứng tuyển nhanh:** Nộp đơn chỉ với một cú click.
- **Theo dõi trạng thái:** Nhận thông báo qua Email về trạng thái đơn ứng tuyển (Đang chờ, Đã xem, Chấp nhận/Từ chối).
- **Chat thời gian thực:** Nhắn tin trực tiếp với nhà tuyển dụng.

### 🏢 Dành cho Nhà tuyển dụng (Doanh nghiệp)
- **Đăng tin tuyển dụng:** Giao diện đăng tin trực quan, hỗ trợ quản lý tin đăng.
- **Quản lý ứng viên:** Xem danh sách người ứng tuyển, xem CV và cập nhật trạng thái hồ sơ.
- **Hồ sơ doanh nghiệp:** Tùy chỉnh trang profile công ty để thu hút nhân tài.
- **Thông báo email:** Nhận thông báo tự động khi có ứng viên mới.

---

## 🛠 Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, Lucide Icons, Shadcn UI.
- **Backend:** Node.js, Express, MongoDB (Mongoose).
- **Authentication:** JWT (Access & Refresh Tokens), HTTP-Only Cookies.
- **Media:** Cloudinary (Lưu trữ ảnh & CV).
- **Notifications:** Nodemailer (SMTP).
- **Real-time:** Socket.io (Hỗ trợ chat).

---

## 🚀 Hướng dẫn cài đặt

### 1. Yêu cầu hệ thống
- Node.js (v18 trở lên)
- MongoDB (Atlas hoặc Local)

### 2. Clone dự án
```bash
git clone https://github.com/thuongcjn/recruitment_plaform.git
cd recruitment_plaform
```

### 3. Cấu hình Backend
Di chuyển vào thư mục `server`:
```bash
cd server
npm install
```
Tạo file `.env` và cấu hình các biến sau:
```env
PORT=5000
MONGO_URI=mongodb_your_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CLIENT_URL=http://localhost:5173

# Cloudinary (Dùng để upload Logo/CV)
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Email Config (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_app_password
# Gemini API (Dùng để sinh nội dung)
GEMINI_API_KEY=your_gemini_key
```

### 4. Cấu hình Frontend
Di chuyển vào thư mục `client`:
```bash
cd ../client
npm install
```
Tạo file `.env`:
```env
VITE_API_URL=http://localhost:5000
```

### 5. Chạy dự án
Mở 2 terminal:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

---

## ☁️ Hướng dẫn Setup lên Cloud (Deployment)

### 🚀 Backend (Vercel / Render / Heroku)
1. Kết nối Repository với dịch vụ cloud (VD: Render.com).
2. Thiết lập **Build Command:** `npm install`.
3. Thiết lập **Start Command:** `node server.js` (hoặc script tương ứng).
4. **Quan trọng:** Add đầy đủ các biến môi trường trong file `.env` vào phần Environment Variables của cloud.

### 🌐 Frontend (Vercel / Netlify)
1. Kết nối Repository với Vercel.
2. Thiết lập **Root Directory:** `client`.
3. Thiết lập **Build Command:** `npm run build`.
4. Thiết lập **Output Directory:** `dist`.
5. Add biến `VITE_API_URL` trỏ về link Backend đã deploy.

---

## 📈 Star History

<a href="https://star-history.com/#thuongcjn/recruitment_plaform&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=thuongcjn/recruitment_plaform&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=thuongcjn/recruitment_plaform&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=thuongcjn/recruitment_plaform&type=Date" />
 </picture>
</a>

---

## 🤝 Đóng góp
Tôi luôn hoan nghênh các đóng góp để cải thiện dự án!
1. Fork dự án.
2. Tạo nhánh tính năng (`git checkout -b feature/AmazingFeature`).
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`).
4. Push lên nhánh (`git push origin feature/AmazingFeature`).
5. Mở Pull Request.

---

## 📄 Giấy phép
Dự án này được cấp phép theo MIT License.

---

[![GitHub Star History](https://api.star-history.com/svg?repos=thuongcjn/recruitment_plaform&type=Date)](https://star-history.com/#thuongcjn/recruitment_plaform&Date)

⭐ **Nếu bạn thích dự án này, hãy cho tôi 1 sao nhé!**
