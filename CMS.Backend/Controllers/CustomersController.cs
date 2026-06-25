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
        private readonly Services.IEmailService _emailService;

        public CustomersController(ApplicationDbContext context, Services.IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // POST: api/Customers (Đăng ký khách hàng mới)
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] Customer customer)
        {
            if (customer == null) return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            if (await _context.Customers.AnyAsync(c => c.Email == customer.Email))
            {
                return BadRequest(new { message = "Email này đã được sử dụng" });
            }

            customer.Password = CMS.Backend.Helpers.PasswordHelper.HashPassword(customer.Password);

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return StatusCode(201, new { message = "Đăng ký thành công", customerId = customer.Id });
        }

        // POST: api/Customers/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (loginDto == null || string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password))
            {
                return BadRequest(new { message = "Email và mật khẩu không được để trống" });
            }

            var hashedPassword = CMS.Backend.Helpers.PasswordHelper.HashPassword(loginDto.Password);
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email == loginDto.Email && c.Password == hashedPassword);

            if (customer == null)
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không chính xác" });
            }

            return Ok(new
            {
                message = "Đăng nhập thành công",
                customer = new
                {
                    customer.Id,
                    customer.FullName,
                    customer.Email,
                    customer.Phone,
                    customer.Address
                }
            });
        }

        // POST: api/Customers/forgot-password
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.Email))
            {
                return BadRequest(new { message = "Email không được để trống" });
            }

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == dto.Email);
            if (customer == null)
            {
                return NotFound(new { message = "Không tìm thấy khách hàng với email này" });
            }

            string newPassword = Guid.NewGuid().ToString().Substring(0, 8);
            customer.Password = CMS.Backend.Helpers.PasswordHelper.HashPassword(newPassword);
            _context.Customers.Update(customer);
            await _context.SaveChangesAsync();

            string subject = "Cấp lại mật khẩu - ThanhLong CMS";
            string body = $@"
<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px; border: 1px solid #eee;'>
    <div style='text-align: center; margin-bottom: 20px;'>
        <h2 style='color: #f97316; margin: 0;'>ThanhLong CMS</h2>
    </div>
    <div style='background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);'>
        <h3 style='color: #333; margin-top: 0;'>Khôi phục mật khẩu</h3>
        <p style='color: #555; line-height: 1.6;'>Chào <strong>{customer.FullName}</strong>,</p>
        <p style='color: #555; line-height: 1.6;'>Chúng tôi nhận được yêu cầu cấp lại mật khẩu cho tài khoản của bạn. Mật khẩu mới của bạn là:</p>
        <div style='background-color: #fff7ed; border-left: 4px solid #f97316; padding: 15px; margin: 20px 0; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #ea580c;'>
            {newPassword}
        </div>
        <p style='color: #555; line-height: 1.6;'>Vui lòng đăng nhập bằng mật khẩu này và thay đổi mật khẩu ngay lập tức để đảm bảo an toàn.</p>
        <div style='text-align: center; margin-top: 30px;'>
            <a href='http://localhost:3000/login' style='background-color: #f97316; color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold; display: inline-block;'>Đăng nhập ngay</a>
        </div>
    </div>
    <div style='text-align: center; margin-top: 20px; color: #999; font-size: 12px;'>
        &copy; {DateTime.Now.Year} ThanhLong CMS. All rights reserved.
    </div>
</div>";
            await _emailService.SendEmailAsync(customer.Email, subject, body);

            return Ok(new { message = "Mật khẩu mới đã được gửi đến email của bạn" });
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

        // ================= 4. API ĐỔI MẬT KHẨU =================
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.OldPassword) || string.IsNullOrEmpty(dto.NewPassword))
            {
                return BadRequest(new { message = "Vui lòng điền đầy đủ thông tin" });
            }

            var hashedOldPassword = CMS.Backend.Helpers.PasswordHelper.HashPassword(dto.OldPassword);
            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Email == dto.Email && c.Password == hashedOldPassword);

            if (customer == null)
            {
                return BadRequest(new { message = "Mật khẩu hiện tại không chính xác" });
            }

            customer.Password = CMS.Backend.Helpers.PasswordHelper.HashPassword(dto.NewPassword);
            _context.Customers.Update(customer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đổi mật khẩu thành công" });
        }
    }

    // Lớp DTO để nhận dữ liệu đăng nhập
    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class ForgotPasswordDto
    {
        public string Email { get; set; }
    }

    public class ChangePasswordDto
    {
        public string Email { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}