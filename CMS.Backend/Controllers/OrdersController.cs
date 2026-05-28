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

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
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
            if (input == null) return BadRequest(new { message = "Dữ liệu đơn hàng không hợp lệ" });

            try
            {
                var newOrder = new Order
                {
                    OrderDate = DateTime.Now,
                    CustomerId = input.CustomerId,
                    Status = 0, // 0: Chờ duyệt
                    Notes = input.Notes
                };

                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync(); // Ép hệ thống sinh ID tự động

                return StatusCode(201, new { message = "Đặt hàng thành công!", orderId = newOrder.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi tạo đơn hàng", detail = ex.Message });
            }
        }
    }

    // Lớp DTO trung gian để hứng dữ liệu từ ReactJS gửi lên
    public class OrderInputDTO
    {
        public int CustomerId { get; set; }
        public string Notes { get; set; }
    }
}