/*
 * Sinh vien: Nguyen Thanh Long
 * Ma so: 2123110003
 * Ngay tao: 21-05-2026
 * Version: 1.0
 */


using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;
using CMS.Data; // Thêm dòng này để gọi ApplicationDbContext

namespace CMS.Backend.Controllers
{
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối vào Controller
        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Lấy toàn bộ dữ liệu từ bảng Categories trong SQL Docker
            var data = _context.Categories.ToList();
            return View(data);
        }
    }
}