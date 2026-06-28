# Lược đồ cơ sở dữ liệu (Database Schema)

Dưới đây là chi tiết các bảng dữ liệu trong hệ thống dựa trên các thực thể (Entities) trong dự án `CMS.Data`.

## 1. Bảng `Advertisement` (Quảng cáo)
| Tên cột | Kiểu dữ liệu (C#) | Chú thích | Khóa / Ràng buộc |
|---|---|---|---|
| Id | int | Khóa chính | PK |
| Title | string? | Tiêu đề quảng cáo | Chiều dài tối đa: 255 ký tự |
| ImageUrl | string | Đường dẫn hình ảnh | Bắt buộc (Required) |
| Link | string? | Đường dẫn liên kết | |
| IsActive | bool | Trạng thái hoạt động | Mặc định: `true` |
| SortOrder | int | Thứ tự sắp xếp | Mặc định: `0` |

## 2. Bảng `Category` (Danh mục bài viết)
| Tên cột | Kiểu dữ liệu (C#) | Chú thích | Khóa / Ràng buộc |
|---|---|---|---|
| Id | int | Khóa chính | PK |
| Name | string | Tên danh mục | VD: Tin Giáo Dục |
| Description | string | Mô tả danh mục | |

## 3. Bảng `CategoryProduct` (Danh mục sản phẩm)
| Tên cột | Kiểu dữ liệu (C#) | Chú thích | Khóa / Ràng buộc |
|---|---|---|---|
| Id | int | Khóa chính | PK |
| Name | string | Tên danh mục sản phẩm | Bắt buộc, Tối đa: 100 ký tự |
| Description | string? | Mô tả danh mục | |
| ImageUrl | string? | Đường dẫn hình ảnh | |

## 4. Bảng `Customer` (Khách hàng)
| Tên cột | Kiểu dữ liệu (C#) | Chú thích | Khóa / Ràng buộc |
|---|---|---|---|
| Id | int | Khóa chính | PK |
| FullName | string | Họ và tên | Bắt buộc |
| Email | string | Địa chỉ Email | Bắt buộc, Đúng định dạng Email |
| Phone | string? | Số điện thoại | |
| Address | string? | Địa chỉ | |
| Password | string | Mật khẩu | Bắt buộc (Lưu mật khẩu thô) |

## 5. Bảng `Order` (Đơn hàng)
| Tên cột | Kiểu dữ liệu (C#) | Chú thích | Khóa / Ràng buộc |
|---|---|---|---|
| Id | int | Khóa chính | PK |
| OrderDate | DateTime | Ngày đặt hàng | Mặc định: Ngày hiện tại (`DateTime.Now`) |
| CustomerId | int | Khóa ngoại liên kết Khách hàng | FK tới `Customer` |
| Status | int | Trạng thái đơn hàng | 0: Chờ duyệt, 1: Đang giao, 2: Đã xong |
| Notes | string? | Ghi chú | |

## 6. Bảng `OrderDetail` (Chi tiết đơn hàng)
| Tên cột | Kiểu dữ liệu (C#) | Chú thích | Khóa / Ràng buộc |
|---|---|---|---|
| Id | int | Khóa chính | PK |
| OrderId | int | Khóa ngoại liên kết Đơn hàng | FK tới `Order` |
| ProductId | int | Khóa ngoại liên kết Sản phẩm | FK tới `Product` |
| Quantity | int | Số lượng | |
| UnitPrice | decimal | Giá tại thời điểm mua | Kiểu dữ liệu SQL: `decimal(18,2)` |

## 7. Bảng `Post` (Bài viết)
| Tên cột | Kiểu dữ liệu (C#) | Chú thích | Khóa / Ràng buộc |
|---|---|---|---|
| Id | int | Khóa chính | PK |
| Title | string | Tiêu đề bài viết | |
| Content | string | Nội dung chi tiết | |
| ImageUrl | string | Hình ảnh đại diện | |
| CreatedDate | DateTime | Ngày tạo bài viết | Mặc định: Ngày hiện tại (`DateTime.Now`) |
| CategoryId | int | Khóa ngoại liên kết Danh mục | FK tới `Category` |

## 8. Bảng `Product` (Sản phẩm)
| Tên cột | Kiểu dữ liệu (C#) | Chú thích | Khóa / Ràng buộc |
|---|---|---|---|
| Id | int | Khóa chính | PK |
| Name | string | Tên sản phẩm | Bắt buộc |
| Description | string? | Mô tả sản phẩm | |
| Price | decimal | Giá sản phẩm | Kiểu SQL: `decimal(18,2)`, Giá trị `> 0` |
| StockQuantity | int | Số lượng tồn kho | |
| ImageUrl | string? | Hình ảnh sản phẩm | |
| CategoryProductId | int | Khóa ngoại liên kết DM Sản phẩm| FK tới `CategoryProduct` |

## 9. Bảng `User` (Người dùng/Tài khoản Quản trị)
| Tên cột | Kiểu dữ liệu (C#) | Chú thích | Khóa / Ràng buộc |
|---|---|---|---|
| Id | int | Khóa chính | PK |
| Username | string | Tên đăng nhập | |
| PasswordHash | string | Mật khẩu (đã mã hóa) | |
| FullName | string | Họ và tên | |
| Role | string | Vai trò | VD: Quản trị viên hoặc Biên tập viên |
