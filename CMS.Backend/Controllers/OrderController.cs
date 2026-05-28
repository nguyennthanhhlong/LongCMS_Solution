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
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context) { _context = context; }

        public IActionResult Index()
        {
            // Include Customer để lấy tên người đặt
            var data = _context.Orders.Include(o => o.Customer).OrderByDescending(o => o.OrderDate).ToList();
            return View(data);
        }
    }
}