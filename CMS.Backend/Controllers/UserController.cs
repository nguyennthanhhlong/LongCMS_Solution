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
using Microsoft.AspNetCore.Authorization;
using System.Linq; // Thêm thư viện này để dùng hàm .Any() và .FirstOrDefault()

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ================= DANH SÁCH (INDEX) =================
        public IActionResult Index()
        {
            var users = _context.Users.ToList();
            return View(users);
        }

        // ================= THÊM MỚI (CREATE) =================
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(User model)
        {
            if (!ModelState.IsValid) return View(model);

            // Kiểm tra xem tên đăng nhập đã tồn tại chưa
            var checkExist = _context.Users.Any(u => u.Username == model.Username);
            if (checkExist)
            {
                ModelState.AddModelError("Username", "Tên đăng nhập này đã có người dùng!");
                return View(model);
            }

            // Hash password
            if (!string.IsNullOrEmpty(model.PasswordHash))
            {
                model.PasswordHash = CMS.Backend.Helpers.PasswordHelper.HashPassword(model.PasswordHash);
            }

            _context.Users.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ================= CHỈNH SỬA (EDIT) =================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            return View(user);
        }

        [HttpPost]
        public IActionResult Edit(User model, string? NewPassword)
        {
            ModelState.Remove("PasswordHash"); // Form Edit không gửi PasswordHash
            if (!ModelState.IsValid) return View(model);

            // Tìm User gốc trong Database (dùng AsNoTracking để đọc độc lập)
            var existingUser = _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == model.Id);
            if (existingUser == null) return NotFound();

            // Xử lý mật khẩu
            if (!string.IsNullOrEmpty(NewPassword))
            {
                model.PasswordHash = CMS.Backend.Helpers.PasswordHelper.HashPassword(NewPassword);
            }
            else
            {
                // Nếu để trống, giữ lại mật khẩu cũ
                model.PasswordHash = existingUser.PasswordHash;
            }

            _context.Users.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ================= XÓA (DELETE) =================
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                if (user.Username == User.Identity.Name)
                {
                    TempData["Error"] = "Không thể xóa tài khoản của chính bạn đang đăng nhập!";
                    return RedirectToAction("Index");
                }

                _context.Users.Remove(user);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}