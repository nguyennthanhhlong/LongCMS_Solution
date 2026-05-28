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
    }
}