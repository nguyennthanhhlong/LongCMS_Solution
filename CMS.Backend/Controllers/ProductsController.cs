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
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 12, [FromQuery] decimal? minPrice = null, [FromQuery] decimal? maxPrice = null, [FromQuery] string? search = null, [FromQuery] int? categoryId = null)
        {
            var query = _context.Products.AsQueryable();

            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryProductId == categoryId.Value);
            }
            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }
            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.Name.Contains(search));
            }

            int totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var products = await query
                .OrderByDescending(p => p.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new { p.Id, p.Name, p.Price, p.ImageUrl, p.StockQuantity })
                .ToListAsync();

            return Ok(new { data = products, totalItems, totalPages, currentPage = page });
        }

        // GET: api/Products/categoryproduct/1
        [HttpGet("categoryproduct/{categoryProductId}")]
        public async Task<IActionResult> GetByCategoryProduct(int categoryProductId, [FromQuery] int page = 1, [FromQuery] int pageSize = 12)
        {
            var query = _context.Products.Where(p => p.CategoryProductId == categoryProductId);
            
            int totalItems = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var products = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new { p.Id, p.Name, p.Price, p.ImageUrl, p.StockQuantity })
                .ToListAsync();

            return Ok(new { data = products, totalItems, totalPages, currentPage = page });
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
            if (product == null) return NotFound(new { message = "Không tìm thấy sản phẩm" });

            return Ok(product);
        }

        // GET: api/Products/newest
        [HttpGet("newest")]
        public async Task<IActionResult> GetNewest()
        {
            var products = await _context.Products
                .OrderByDescending(p => p.Id)
                .Take(3)
                .Select(p => new { p.Id, p.Name, p.Price, p.ImageUrl, p.StockQuantity })
                .ToListAsync();

            return Ok(products);
        }

        // GET: api/Products/hot
        [HttpGet("hot")]
        public async Task<IActionResult> GetHot()
        {
            // Lấy ID 3 sản phẩm có tổng số lượng bán nhiều nhất từ bảng OrderDetails
            var topProductIds = await _context.OrderDetails
                .GroupBy(od => od.ProductId)
                .OrderByDescending(g => g.Sum(od => od.Quantity))
                .Take(3)
                .Select(g => g.Key)
                .ToListAsync();

            var products = await _context.Products
                .Where(p => topProductIds.Contains(p.Id))
                .Select(p => new { p.Id, p.Name, p.Price, p.ImageUrl, p.StockQuantity })
                .ToListAsync();

            // Fallback nếu cửa hàng chưa có ai mua hàng
            if (products.Count == 0)
            {
                products = await _context.Products
                    .Take(3)
                    .Select(p => new { p.Id, p.Name, p.Price, p.ImageUrl, p.StockQuantity })
                    .ToListAsync();
            }

            return Ok(products);
        }
    }
}