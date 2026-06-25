/*
 * Sinh vien: Nguyen Thanh Long
 * Ma so: 2123110003
 * Ngay tao: 28-05-2026
 * Version: 1.0
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CMS.Data.Entities;
using CMS.Data;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ================= 1. DANH SÁCH KHÁCH HÀNG =================
        public IActionResult Index(int page = 1)
        {
            int pageSize = 10;
            var query = _context.Customers;
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

        // ================= 2. THÊM MỚI KHÁCH HÀNG =================
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(Customer model)
        {
            if (!ModelState.IsValid) return View(model);

            // Kiểm tra trùng Email
            var checkExist = _context.Customers.Any(c => c.Email == model.Email);
            if (checkExist)
            {
                ModelState.AddModelError("Email", "Email này đã được sử dụng!");
                return View(model);
            }

            // Hash password
            if (!string.IsNullOrEmpty(model.Password))
            {
                model.Password = CMS.Backend.Helpers.PasswordHelper.HashPassword(model.Password);
            }

            _context.Customers.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ================= 3. CHỈNH SỬA KHÁCH HÀNG =================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null) return NotFound();
            return View(customer);
        }

        [HttpPost]
        public IActionResult Edit(Customer model)
        {
            ModelState.Remove("Password"); // Cho phép để trống password khi sửa
            if (!ModelState.IsValid) return View(model);

            var existingCustomer = _context.Customers.AsNoTracking().FirstOrDefault(c => c.Id == model.Id);
            if (existingCustomer == null) return NotFound();

            // Kiểm tra trùng Email với người khác
            var checkEmail = _context.Customers.Any(c => c.Email == model.Email && c.Id != model.Id);
            if (checkEmail)
            {
                ModelState.AddModelError("Email", "Email này đã được sử dụng bởi khách hàng khác!");
                return View(model);
            }

            // Hash password nếu có nhập mới
            if (!string.IsNullOrEmpty(model.Password))
            {
                model.Password = CMS.Backend.Helpers.PasswordHelper.HashPassword(model.Password);
            }
            else
            {
                model.Password = existingCustomer.Password;
            }

            _context.Customers.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // ================= 4. XÓA KHÁCH HÀNG =================
        public IActionResult Delete(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer != null)
            {
                // Kiểm tra xem khách hàng đã có đơn hàng chưa
                var hasOrders = _context.Orders.Any(o => o.CustomerId == id);
                if (hasOrders)
                {
                    TempData["Error"] = "Không thể xóa khách hàng này vì đã có đơn hàng trong hệ thống!";
                    return RedirectToAction("Index");
                }

                _context.Customers.Remove(customer);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}