/*
 * Sinh vien: Nguyen Thanh Long
 * Ma so: 2123110003
 * Ngay tao: 28-05-2026
 * Version: 1.0 
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using CMS.Data.Entities;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class OrderDetailController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ================= 1. DANH SÁCH CHI TIẾT ĐƠN HÀNG =================
        public IActionResult Index()
        {
            // Dùng .Include để kéo thông tin Mã Đơn Hàng và Tên Sản Phẩm đi kèm nhằm hiển thị ngoài Grid
            var data = _context.OrderDetails
                .Include(od => od.Order)
                .Include(od => od.Product)
                .ToList();
            return View(data);
        }

        // ================= 2. THÊM SẢN PHẨM VÀO ĐƠN HÀNG =================
        [HttpGet]
        public IActionResult Create()
        {
            // Chuẩn bị danh sách Mã Đơn Hàng và danh sách Tên Sản phẩm đổ vào ô chọn Dropdown
            ViewBag.OrderList = new SelectList(_context.Orders, "Id", "Id");
            ViewBag.ProductList = new SelectList(_context.Products, "Id", "Name");
            return View();
        }

        [HttpPost]
        public IActionResult Create(OrderDetail model)
        {
            _context.OrderDetails.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ================= 3. ĐIỀU CHỈNH SỐ LƯỢNG / ĐƠN GIÁ =================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var detail = _context.OrderDetails.Find(id);
            if (detail == null) return NotFound();

            ViewBag.OrderList = new SelectList(_context.Orders, "Id", "Id", detail.OrderId);
            ViewBag.ProductList = new SelectList(_context.Products, "Id", "Name", detail.ProductId);
            return View(detail);
        }

        [HttpPost]
        public IActionResult Edit(OrderDetail model)
        {
            _context.OrderDetails.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ================= 4. XÓA MẶT HÀNG KHỎI ĐƠN HÀNG =================
        public IActionResult Delete(int id)
        {
            var detail = _context.OrderDetails.Find(id);
            if (detail != null)
            {
                _context.OrderDetails.Remove(detail);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}