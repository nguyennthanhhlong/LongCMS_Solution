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
using Microsoft.AspNetCore.Mvc.Rendering;

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

        // ================= THÊM MỚI BÀI VIẾT =================
        [HttpGet]
        public IActionResult Create()
        {
            // Truyền danh sách Category sang View để làm thẻ <select>
            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name");
            return View();
        }

        [HttpPost]
        public IActionResult Create(Post model, IFormFile uploadImage)
        {
            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }
                model.ImageUrl = "/uploads/" + fileName;
            }

            // Gán ngày hiện tại nếu rỗng
            if (model.CreatedDate == default(DateTime)) model.CreatedDate = DateTime.Now;

            _context.Posts.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ================= XÓA BÀI VIẾT =================
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.Find(id);
            if (post != null)
            {
                _context.Posts.Remove(post);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        // ================= SỬA BÀI VIẾT =================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null) return NotFound();

            // Truyền dữ liệu danh mục, mặc định chọn đúng danh mục hiện tại của bài viết
            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
            return View(post);
        }

        [HttpPost]
        public IActionResult Edit(Post model, IFormFile uploadImage)
        {
            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }
                model.ImageUrl = "/uploads/" + fileName;
            }
            else
            {
                // Nếu không upload ảnh mới, giữ nguyên đường dẫn ảnh cũ
                var oldPost = _context.Posts.AsNoTracking().FirstOrDefault(p => p.Id == model.Id);
                if (oldPost != null && string.IsNullOrEmpty(model.ImageUrl))
                {
                    model.ImageUrl = oldPost.ImageUrl;
                }
            }

            _context.Posts.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }
    }
}