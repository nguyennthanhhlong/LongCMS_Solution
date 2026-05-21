/*
 * Sinh vien: Nguyen Thanh Long
 * Ma so: 2123110003
 * Ngay tao: 21-05-2026
 * Version: 1.0
 */


using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data.Entities;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // 💡 Mẹo nhỏ: Dùng .Include(p => p.Category) để lấy kèm thông tin Danh mục (tên danh mục)
            // thay vì chỉ lấy được mỗi con số CategoryId.
            var posts = _context.Posts.Include(p => p.Category).ToList();
            return View(posts);
        }
    }
}