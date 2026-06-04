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
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Customers (Đăng ký khách hàng mới)
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] Customer customer)
        {
            if (customer == null) return BadRequest("Dữ liệu không hợp lệ");

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return StatusCode(201, new { message = "Đăng ký thành công", customerId = customer.Id });
        }

        // ================= 1. API LẤY TOÀN BỘ KHÁCH HÀNG =================
        // GET: api/Customers
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var customers = await _context.Customers
                .Select(c => new
                {
                    c.Id,
                    c.FullName,
                    c.Email,
                    c.Phone,
                    c.Address
                })
                .ToListAsync();

            return Ok(customers);
        }

        // ================= 2. API LẤY CHI TIẾT 1 KHÁCH HÀNG =================
        // GET: api/Customers/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var customer = await _context.Customers
                .Select(c => new
                {
                    c.Id,
                    c.FullName,
                    c.Email,
                    c.Phone,
                    c.Address
                })
                .FirstOrDefaultAsync(c => c.Id == id);

            if (customer == null)
            {
                return NotFound(new { message = "Không tìm thấy thông tin khách hàng này!" });
            }

            return Ok(customer);
        }

        // ================= 3. API XÓA TÀI KHOẢN KHÁCH HÀNG =================
        // DELETE: api/Customers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound(new { message = "Khách hàng không tồn tại hoặc đã bị xóa trước đó." });
            }

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa tài khoản khách hàng thành công!" });
        }
    }
}