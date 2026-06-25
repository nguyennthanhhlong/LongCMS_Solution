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
        public IActionResult Index(int? orderId)
        {
            var query = _context.OrderDetails
                .Include(od => od.Order)
                .Include(od => od.Product)
                .AsQueryable();

            if (orderId.HasValue)
            {
                query = query.Where(od => od.OrderId == orderId.Value);
                ViewBag.OrderId = orderId.Value;
            }

            var data = query.ToList();
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
            var product = _context.Products.Find(model.ProductId);
            if (product != null)
            {
                product.StockQuantity -= model.Quantity;
                if (product.StockQuantity < 0) product.StockQuantity = 0;
            }

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
            var existingDetail = _context.OrderDetails.AsNoTracking().FirstOrDefault(od => od.Id == model.Id);
            if (existingDetail != null)
            {
                var product = _context.Products.Find(model.ProductId);
                if (product != null)
                {
                    // Nếu sửa sản phẩm khác, thì hoàn số lượng cho sản phẩm cũ và trừ số lượng sản phẩm mới
                    if (existingDetail.ProductId != model.ProductId)
                    {
                        var oldProduct = _context.Products.Find(existingDetail.ProductId);
                        if (oldProduct != null) oldProduct.StockQuantity += existingDetail.Quantity;
                        
                        product.StockQuantity -= model.Quantity;
                    }
                    else
                    {
                        // Nếu cùng sản phẩm, chỉ tính chênh lệch
                        int diff = model.Quantity - existingDetail.Quantity;
                        product.StockQuantity -= diff;
                    }
                    if (product.StockQuantity < 0) product.StockQuantity = 0;
                }
            }

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
                var product = _context.Products.Find(detail.ProductId);
                if (product != null)
                {
                    product.StockQuantity += detail.Quantity;
                }

                _context.OrderDetails.Remove(detail);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        // ================= 5. LẤY GIÁ SẢN PHẨM HIỆN TẠI =================
        [HttpGet]
        public IActionResult GetProductPrice(int id)
        {
            var product = _context.Products.Find(id);
            if (product != null)
            {
                return Json(product.Price);
            }
            return Json(0);
        }
    }
}