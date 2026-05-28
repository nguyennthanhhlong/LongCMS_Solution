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

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /Post/Index hoặc /Post/Index/5
        public IActionResult Index(int? id)
        {
            // Nếu không có ID truyền vào, lấy tất cả bài viết
            if (id == null)
            {
                var allPosts = _context.Posts
                    .Include(p => p.Category)
                    .OrderByDescending(p => p.CreatedDate)
                    .ToList();
                return View(allPosts);
            }

            // Nếu có ID, dùng LINQ để lọc và sắp xếp
            var posts = _context.Posts
                .Where(p => p.CategoryId == id)
                .OrderByDescending(p => p.CreatedDate)
                .Include(p => p.Category)
                .ToList();

            return View(posts);
        }

        // GET: /Post/Details/5
        public IActionResult Details(int id)
        {
            // Truy vấn bài viết theo ID, lấy kèm thông tin Danh mục
            var post = _context.Posts
                .Include(p => p.Category)
                .FirstOrDefault(p => p.Id == id);

            if (post == null)
            {
                return NotFound(); // Trả về lỗi 404 nếu không tìm thấy
            }

            return View(post);
        }
    }
}