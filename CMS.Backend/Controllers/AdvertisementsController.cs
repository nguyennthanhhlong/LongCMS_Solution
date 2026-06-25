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
    public class AdvertisementsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdvertisementsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetActiveAdvertisements()
        {
            var ads = await _context.Advertisements
                .Where(a => a.IsActive)
                .OrderBy(a => a.SortOrder)
                .ThenByDescending(a => a.Id)
                .Select(a => new
                {
                    a.Id,
                    a.Title,
                    a.ImageUrl,
                    a.Link
                })
                .ToListAsync();

            return Ok(ads);
        }
    }
}
