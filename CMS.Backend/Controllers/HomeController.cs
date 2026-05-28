/*
 * Sinh vien: Nguyen Thanh Long
 * Ma so: 2123110003
 * Ngay tao: 28-05-2026
 * Version: 1.0
 */


using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data; // Thư mục chứa DbContext
using System.Diagnostics;
using CMS.Backend.Models; // Dành cho ErrorViewModel mặc định

namespace CMS.Backend.Controllers
{
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _context;

        // "Tiêm" DbContext vào HomeController
        public HomeController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // LINQ: Lấy 3 bài viết mới nhất
            var latestPosts = _context.Posts
                .Include(p => p.Category)               // Lấy kèm tên danh mục
                .OrderByDescending(p => p.CreatedDate)  // Sắp xếp ngày mới nhất lên đầu
                .Take(3)                                // Chỉ lấy đúng 3 bản tin đầu tiên
                .ToList();

            return View(latestPosts);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}