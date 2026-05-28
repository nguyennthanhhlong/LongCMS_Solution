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
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/OrderDetails/Order/1
        [HttpGet("Order/{orderId}")]
        public async Task<IActionResult> GetByOrderId(int orderId)
        {
            var details = await _context.OrderDetails
                .Where(od => od.OrderId == orderId)
                .Select(od => new
                {
                    od.Id,
                    od.ProductId,
                    ProductName = od.Product.Name,
                    od.Quantity,
                    od.UnitPrice,
                    Total = od.Quantity * od.UnitPrice
                })
                .ToListAsync();

            return Ok(details);
        }
    }
}