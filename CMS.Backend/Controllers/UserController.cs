/*
 * Sinh vien: Nguyen Thanh Long
 * Ma so: 2123110003
 * Ngay tao: 21-05-2026
 * Version: 1.0
 */


using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var users = _context.Users.ToList();
            return View(users);
        }
    }
}