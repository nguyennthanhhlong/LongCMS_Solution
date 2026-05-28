/*
 * Sinh vien: Nguyen Thanh Long
 * Ma so: 2123110003
 * Ngay tao: 28-05-2026
 * Version: 1.0
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context) { _context = context; }

        public IActionResult Index()
        {
            // Dùng Include để lấy tên Danh mục sản phẩm
            var data = _context.Products.Include(p => p.CategoryProduct).ToList();
            return View(data);
        }
    }
}