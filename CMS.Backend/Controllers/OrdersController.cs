/*
 * Sinh vien: Nguyen Thanh Long
 * Ma so: 2123110003
 * Ngay tao: 28-05-2026
 * Version: 1.0
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data.Entities;
using CMS.Data;
using System;
using System.Threading.Tasks;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly Services.IEmailService _emailService;

        public OrdersController(ApplicationDbContext context, Services.IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // GET: api/Orders (Lấy lịch sử đơn hàng)
        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new { o.Id, o.OrderDate, o.CustomerId, o.Status, o.Notes })
                .ToListAsync();
            return Ok(orders);
        }

        // POST: api/Orders (Tiếp nhận đơn hàng mới)
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderInputDTO input)
        {
            if (input == null || input.OrderDetails == null || !input.OrderDetails.Any())
                return BadRequest(new { message = "Dữ liệu đơn hàng không hợp lệ hoặc giỏ hàng trống" });

            // Using transaction to ensure both order creation and stock update succeed
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var customerExists = await _context.Customers.AnyAsync(c => c.Id == input.CustomerId);
                if (!customerExists)
                {
                    return BadRequest(new { message = "Tài khoản khách hàng không tồn tại hoặc đã bị xóa. Vui lòng đăng nhập lại!" });
                }

                var newOrder = new Order
                {
                    OrderDate = DateTime.Now,
                    CustomerId = input.CustomerId,
                    Status = 0, // 0: Chờ duyệt
                    Notes = input.Notes
                };

                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync(); // Sinh ID tự động cho Order

                string orderItemsHtml = "<table style='width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px;'>";
                orderItemsHtml += "<thead><tr style='background-color: #f3f4f6; text-align: left;'><th style='padding: 12px; border-bottom: 2px solid #e5e7eb;'>Sản phẩm</th><th style='padding: 12px; border-bottom: 2px solid #e5e7eb;'>Đơn giá</th><th style='padding: 12px; border-bottom: 2px solid #e5e7eb; text-align: center;'>SL</th><th style='padding: 12px; border-bottom: 2px solid #e5e7eb; text-align: right;'>Thành tiền</th></tr></thead>";
                orderItemsHtml += "<tbody>";
                decimal totalAmount = 0;

                foreach (var item in input.OrderDetails)
                {
                    var product = await _context.Products.FindAsync(item.ProductId);
                    if (product == null)
                    {
                        throw new Exception($"Sản phẩm có ID {item.ProductId} không tồn tại.");
                    }

                    if (product.StockQuantity < item.Quantity)
                    {
                        throw new Exception($"Sản phẩm '{product.Name}' không đủ số lượng trong kho.");
                    }

                    // Trừ tồn kho
                    product.StockQuantity -= item.Quantity;
                    _context.Products.Update(product);

                    // Thêm chi tiết đơn hàng
                    var orderDetail = new OrderDetail
                    {
                        OrderId = newOrder.Id,
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price // Hoặc item.UnitPrice
                    };
                    _context.OrderDetails.Add(orderDetail);

                    // Build HTML cho Email
                    decimal itemTotal = item.Quantity * product.Price;
                    totalAmount += itemTotal;

                    orderItemsHtml += "<tr>";
                    // hiển thị tên sản phẩm
                    orderItemsHtml += $"<td style='padding: 12px; border-bottom: 1px solid #e5e7eb;'><span style='font-weight: 500; color: #374151;'>{product.Name}</span></td>";
                    orderItemsHtml += $"<td style='padding: 12px; border-bottom: 1px solid #e5e7eb; color: #4b5563;'>{product.Price:N0}đ</td>";
                    orderItemsHtml += $"<td style='padding: 12px; border-bottom: 1px solid #e5e7eb; color: #4b5563; text-align: center;'>{item.Quantity}</td>";
                    orderItemsHtml += $"<td style='padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #111827; text-align: right;'>{itemTotal:N0}đ</td>";
                    orderItemsHtml += "</tr>";
                }

                // Trích xuất mã giảm giá từ Ghi chú
                decimal discountAmount = 0;
                if (!string.IsNullOrEmpty(input.Notes))
                {
                    var match = System.Text.RegularExpressions.Regex.Match(input.Notes, @"\[Voucher:\s*-([0-9.,]+)\s*₫\]");
                    if (match.Success)
                    {
                        var discountStr = match.Groups[1].Value.Replace(".", "").Replace(",", "");
                        if (decimal.TryParse(discountStr, out decimal parsedDiscount))
                        {
                            discountAmount = parsedDiscount;
                        }
                    }
                }

                orderItemsHtml += "</tbody>";
                if (discountAmount > 0)
                {
                    orderItemsHtml += $"<tr><td colspan='3' style='padding: 10px 12px; text-align: right; font-weight: bold; font-size: 14px; color: #10b981;'>GIẢM GIÁ (VOUCHER):</td><td style='padding: 10px 12px; font-weight: bold; color: #10b981; font-size: 15px; text-align: right;'>-{discountAmount:N0}đ</td></tr>";
                }

                decimal finalAmount = totalAmount - discountAmount;
                if (finalAmount < 0) finalAmount = 0;

                orderItemsHtml += $"<tfoot><tr><td colspan='3' style='padding: 15px 12px; text-align: right; font-weight: bold; font-size: 15px; color: #374151;'>TỔNG TIỀN THANH TOÁN:</td><td style='padding: 15px 12px; font-weight: 900; color: #ef4444; font-size: 18px; text-align: right;'>{finalAmount:N0}đ</td></tr></tfoot>";
                orderItemsHtml += "</table>";

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // Gửi email xác nhận
                var customer = await _context.Customers.FindAsync(input.CustomerId);
                if (customer != null && !string.IsNullOrEmpty(customer.Email))
                {
                    string subject = $"Xác nhận đơn hàng #{newOrder.Id} - ThanhLong CMS";
                    string body = $@"
<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px; border: 1px solid #eee;'>
    <div style='text-align: center; margin-bottom: 20px;'>
        <h2 style='color: #10b981; margin: 0;'>ThanhLong CMS</h2>
    </div>
    <div style='background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);'>
        <div style='text-align: center; margin-bottom: 20px;'>
            <h3 style='color: #10b981; margin: 0; font-size: 24px;'>Đặt hàng thành công! 🎉</h3>
        </div>
        <p style='color: #555; line-height: 1.6;'>Chào <strong>{customer.FullName}</strong>,</p>
        <p style='color: #555; line-height: 1.6;'>Cảm ơn bạn đã tin tưởng và mua sắm tại hệ thống của chúng tôi. Đơn hàng của bạn đã được ghi nhận và đang trong quá trình xử lý.</p>
        <div style='background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;'>
            <p style='margin: 0 0 10px 0; color: #065f46;'><strong>Mã đơn hàng:</strong> #{newOrder.Id}</p>
            <p style='margin: 0 0 10px 0; color: #065f46;'><strong>Thời gian đặt:</strong> {newOrder.OrderDate:dd/MM/yyyy HH:mm}</p>
            <p style='margin: 0; color: #065f46;'><strong>Ghi chú:</strong> {newOrder.Notes ?? "Không có"}</p>
        </div>
        
        <div style='margin: 30px 0;'>
            <h4 style='color: #374151; margin-bottom: 10px; font-size: 18px; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;'>Chi tiết đơn hàng</h4>
            {orderItemsHtml}
        </div>

        <p style='color: #555; line-height: 1.6;'>Chúng tôi sẽ liên hệ với bạn qua số điện thoại để xác nhận đơn hàng trong thời gian sớm nhất.</p>
        <div style='text-align: center; margin-top: 30px;'>
            <a href='http://localhost:3000/profile' style='background-color: #10b981; color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold; display: inline-block;'>Xem lịch sử đơn hàng</a>
        </div>
    </div>
    <div style='text-align: center; margin-top: 20px; color: #999; font-size: 12px;'>
        &copy; {DateTime.Now.Year} ThanhLong CMS. All rights reserved.
    </div>
</div>";
                    await _emailService.SendEmailAsync(customer.Email, subject, body);
                }

                return StatusCode(201, new { message = "Đặt hàng thành công!", orderId = newOrder.Id });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Lỗi tạo đơn hàng", detail = ex.Message });
            }
        }
    }

    // Lớp DTO trung gian để hứng dữ liệu từ ReactJS gửi lên
    public class OrderInputDTO
    {
        public int CustomerId { get; set; }
        public string Notes { get; set; }
        public List<OrderDetailInputDTO> OrderDetails { get; set; }
    }

    public class OrderDetailInputDTO
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}