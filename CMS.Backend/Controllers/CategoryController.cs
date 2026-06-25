/*
 * Sinh vien: Nguyen Thanh Long
 * Ma so: 2123110003
 * Ngay tao: 28-05-2026
 * Version: 1.0
 */


using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;
using CMS.Data; // Thêm dòng này để gọi ApplicationDbContext
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối vào Controller
        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index(int page = 1)
        {
            int pageSize = 10;
            var query = _context.Categories;
            int totalItems = query.Count();
            int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var data = query.OrderByDescending(c => c.Id)
                            .Skip((page - 1) * pageSize)
                            .Take(pageSize)
                            .ToList();
            
            ViewBag.CurrentPage = page;
            ViewBag.TotalPages = totalPages;
            return View(data);
        }

        // ================= THÊM MỚI (CREATE) =================
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(Category model)
        {
            _context.Categories.Add(model); // Bước 1: Đưa vào bộ nhớ tạm
            _context.SaveChanges();         // Bước 2: Ghi xuống SQL
            return RedirectToAction("Index");
        }

        // ================= XÓA (DELETE) =================
        public IActionResult Delete(int id)
        {
            var category = _context.Categories.Find(id);
            if (category != null)
            {
                // Kiểm tra xem chuyên mục này có đang chứa bài viết nào không
                var hasPosts = _context.Posts.Any(p => p.CategoryId == id);
                if (hasPosts)
                {
                    TempData["Error"] = "Không thể xóa chuyên mục này vì đang có bài viết thuộc chuyên mục!";
                    return RedirectToAction("Index");
                }

                _context.Categories.Remove(category);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        // ================= CHỈNH SỬA (EDIT) =================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var category = _context.Categories.Find(id);
            if (category == null) return NotFound();
            return View(category);
        }

        [HttpPost]
        public IActionResult Edit(Category model)
        {
            _context.Categories.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }
    }
}