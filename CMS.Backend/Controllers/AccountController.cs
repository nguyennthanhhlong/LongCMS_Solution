/*
 * Sinh vien: Nguyen Thanh Long
 * Ma so: 2123110003
 * Ngay tao: 28-05-2026
 * Version: 1.0
 */


using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using CMS.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace CMS.Backend.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ================= HIỂN THỊ GIAO DIỆN ĐĂNG NHẬP =================
        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        // ================= XỬ LÝ LOGIC ĐĂNG NHẬP =================
        [HttpPost]
        public async Task<IActionResult> Login(string username, string password)
        {
            string hashedInput = CMS.Backend.Helpers.PasswordHelper.HashPassword(password);

            // Kiểm tra tài khoản: cho phép cả mật khẩu đã hash hoặc mật khẩu cũ chưa hash
            var user = _context.Users.FirstOrDefault(u => u.Username == username && (u.PasswordHash == hashedInput || u.PasswordHash == password));

            if (user != null)
            {
                // Nếu đúng, tạo ra các "Claims" (Mẩu thông tin định danh)
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role), // Quan trọng: Quyết định quyền Admin/Editor
                    new Claim("FullName", user.FullName)
                };

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                // Lưu thẻ chứng nhận (Cookie) vào trình duyệt
                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity));

                return RedirectToAction("Index", "Home");
            }

            // Nếu sai, báo lỗi
            ViewBag.Error = "Tên đăng nhập hoặc mật khẩu không đúng!";
            return View();
        }

        // ================= ĐĂNG XUẤT =================
        public async Task<IActionResult> Logout()
        {
            // Xóa Cookie
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login");
        }

        // ================= TỪ CHỐI TRUY CẬP (SAI QUYỀN) =================
        [HttpGet]
        public IActionResult AccessDenied()
        {
            return View();
        }
    }
}