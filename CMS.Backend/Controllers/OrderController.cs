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
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ================= 1. DANH SÁCH ĐƠN HÀNG =================
        public IActionResult Index()
        {
            // Dùng .Include(o => o.Customer) để lấy thông tin Tên khách hàng từ bảng Customers
            var data = _context.Orders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.OrderDate)
                .ToList();
            return View(data);
        }

        // ================= 2. TẠO ĐƠN HÀNG THỦ CÔNG =================
        [HttpGet]
        public IActionResult Create()
        {
            // Lấy danh sách Khách hàng đổ vào Dropdown để chọn người mua cho đơn hàng này
            ViewBag.CustomerList = new SelectList(_context.Customers, "Id", "FullName");
            return View();
        }

        [HttpPost]
        public IActionResult Create(Order model)
        {
            _context.Orders.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ================= 3. CẬP NHẬT ĐƠN HÀNG =================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var order = _context.Orders.Find(id);
            if (order == null) return NotFound();

            // Đổ danh sách Khách hàng sang Form sửa, mặc định chọn đúng khách hàng của ĐH đó
            ViewBag.CustomerList = new SelectList(_context.Customers, "Id", "FullName", order.CustomerId);
            return View(order);
        }

        [HttpPost]
        public IActionResult Edit(Order model)
        {
            _context.Orders.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ================= 4. XÓA ĐƠN HÀNG =================
        public IActionResult Delete(int id)
        {
            var order = _context.Orders.Find(id);
            if (order != null)
            {
                _context.Orders.Remove(order);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}