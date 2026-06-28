# 🍔 ThanhLong CMS & eCommerce Platform

Chào mừng đến với **ThanhLong CMS**, một nền tảng quản trị nội dung (CMS) và thương mại điện tử (eCommerce) toàn diện. Dự án được xây dựng với kiến trúc kết hợp, sử dụng **ASP.NET Core (Backend - MVC & Web API)** và **React.js (Frontend)**, tối ưu hoá cho tốc độ, tính năng và trải nghiệm người dùng hiện đại.

Hệ thống hiện tại đang phục vụ cho lĩnh vực F&B (FastFood & Đồ uống), cho phép khách hàng đặt món trực tuyến và cho phép quản trị viên quản lý toàn bộ hệ thống từ bảng điều khiển.

---

## ✨ Tính Năng Nổi Bật

### 🌐 Frontend (React.js)
Dành cho Khách hàng trải nghiệm mua sắm mượt mà.
- **Trang Chủ Hiện Đại:** Hero Banner động (chạy slide) lấy dữ liệu trực tiếp từ hệ thống quản trị.
- **Danh Mục Món Ăn/Sản Phẩm:** Hiển thị trực quan dưới dạng các khối tròn/vuông, lọc nhanh các sản phẩm khi click.
- **Trang Cửa Hàng (Shop):** Tích hợp phân trang, thanh tìm kiếm thông minh và bộ lọc khoảng giá (Min-Max) được xử lý trực tiếp tại Server. Có giao diện trống (Empty state) thân thiện khi không tìm thấy kết quả.
- **Giỏ Hàng & Thanh Toán:** Quản lý giỏ hàng nhanh chóng và dễ dàng.
- **Góc Ẩm Thực (Blog):** Hiển thị các bài viết review ẩm thực, đọc chi tiết bằng HTML mượt mà.
- **Tài khoản & Bảo mật:** Luồng Đăng nhập, Đăng ký (mã hoá SHA256) chống trùng lặp, tính năng Quên mật khẩu gửi mail mật khẩu mới tự động.

### ⚙️ Backend (ASP.NET Core)
Bao gồm Cổng thông tin Quản trị (Admin MVC) và hệ thống RESTful API cho Client.
- **Bảng Điều Khiển (Admin Dashboard):** Giao diện quản trị hiện đại.
- **Quản lý đa dạng dữ liệu:** Cung cấp đầy đủ các thao tác CRUD (Thêm, Sửa, Xóa, Xem) đối với: `Sản Phẩm`, `Danh Mục`, `Khách Hàng`, `Đơn Hàng`, `Bài Viết`, và `Quảng Cáo (Banner)`.
- **Phân trang toàn diện:** Hỗ trợ phân trang hiệu quả giúp tải dữ liệu lớn với hiệu năng cao đối với tất cả các module trong Admin.
- **REST API Mạnh mẽ:** Cung cấp dữ liệu chuẩn JSON cho Frontend React với khả năng Filter, Search và Pagination linh hoạt.
- **Dịch vụ Gửi Email Tự Động (SMTP):** Tích hợp gửi email xác nhận đặt hàng và email cấp lại mật khẩu.

---

## 🛠️ Công Nghệ Sử Dụng

**Backend:**
- ASP.NET Core 8.0 (MVC & Web API)
- Entity Framework Core (ORM)
- SQL Server
- Mật mã SHA256 (Security)

**Frontend:**
- React.js (Create React App)
- TailwindCSS (Styling & Design)
- Axios (API Client)
- React Router DOM (Routing)

---

## 🚀 Hướng Dẫn Cài Đặt Và Chạy Hệ Thống

Để khởi chạy hệ thống trên môi trường máy cục bộ (Local), vui lòng thực hiện theo các bước chi tiết sau:

### Yêu Cầu Cài Đặt (Prerequisites)
1. [.NET 8.0 SDK](https://dotnet.microsoft.com/download)
2. [Node.js](https://nodejs.org/) (Khuyến nghị phiên bản v18.x trở lên)
3. Cơ Sở Dữ Liệu **SQL Server** (Hoặc SQL Server Management Studio/Azure Data Studio để truy cập).

### Bước 1: Khởi Tạo Cơ Sở Dữ Liệu
Dự án này sử dụng truy vấn SQL nguyên bản để cập nhật DB, tránh lỗi Migration tự động.
1. Mở **SQL Server Management Studio (SSMS)** và kết nối với server của bạn.
2. Tại thư mục gốc của dự án, mở file `db_updates.sql`.
3. Chạy toàn bộ các câu lệnh SQL trong file đó trên DB hiện tại của bạn để cập nhật cấu trúc bảng mới (ví dụ: tạo bảng `Advertisements`, cập nhật các khóa ngoại cần thiết).

### Bước 2: Chạy Hệ Thống Backend (CMS.Backend)
1. Mở Terminal / Command Prompt và di chuyển vào thư mục Backend:
   ```bash
   cd CMS.Backend
   ```
2. Cập nhật file cấu hình kết nối DB: Mở file `appsettings.json` (và `appsettings.Development.json` nếu có) và cấu hình `DefaultConnection` khớp với máy tính của bạn:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=CMS_ThanhLong;Trusted_Connection=True;TrustServerCertificate=True"
   }
   ```
3. Cập nhật thông tin SMTP để gửi Email (nếu cần test chức năng quên mật khẩu):
   ```json
   "EmailSettings": {
     "MailServer": "smtp.gmail.com",
     "MailPort": 587,
     "SenderName": "ThanhLong CMS",
     "SenderEmail": "your-email@gmail.com",
     "SenderPassword": "your-app-password"
   }
   ```
4. Khởi chạy Backend bằng Visual Studio (Nhấn `F5`) hoặc thông qua CLI:
   ```bash
   dotnet run
   ```
> Backend sẽ chạy trên cổng `http://localhost:5000` (API) hoặc `https://localhost:5001`. Cổng cụ thể được quy định tại `Properties/launchSettings.json`. **Bạn có thể truy cập `/` hoặc `/Product/Index` để vào trang Admin.**

### Bước 3: Chạy Hệ Thống Frontend (React.js)
1. Mở một cửa sổ Terminal mới và di chuyển vào thư mục Frontend:
   ```bash
   cd cms.frontend
   ```
2. Cài đặt các thư viện cần thiết:
   ```bash
   npm install
   ```
3. (Tùy chọn) Kiểm tra đường dẫn API: Đảm bảo file `.env` tại thư mục gốc của `cms.frontend` có biến chỉ định API chính xác (phải khớp với URL của backend bạn vừa bật).
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_IMAGE_BASE_URL=http://localhost:5000
   ```
4. Khởi chạy máy chủ Frontend:
   ```bash
   npm start
   ```
> Frontend sẽ tự động mở trên trình duyệt tại `http://localhost:3000`.

---

## 👨‍💻 Tác Giả & Phiên Bản
- **Phiên bản:** 1.0.0
- **Bản quyền:** Hệ thống phát triển dành cho mục đích giáo dục và thương mại cơ bản.
- **Sản phẩm:** Nguyễn Thành Long (2123110003)

Chúc bạn có trải nghiệm tuyệt vời với nền tảng này! 🎉
