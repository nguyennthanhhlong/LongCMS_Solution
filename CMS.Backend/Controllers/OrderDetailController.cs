/*
*Sinh vien: Nguyen Thanh Long
* Ma so: 2123110003
* Ngay tao: 28 - 05 - 2026
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
    public class OrderDetailController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailController(ApplicationDbContext context) { _context = context; }

        public IActionResult Index()
        {
            // Lấy cả Order và Product để hiện chi tiết
            var data = _context.OrderDetails
                .Include(od => od.Order)
                .Include(od => od.Product)
                .ToList();
            return View(data);
        }
    }
}