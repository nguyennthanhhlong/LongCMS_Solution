/*
 * Sinh vien: Nguyen Thanh Long
 * Ma so: 2123110003
 * Ngay tao: 21-05-2026
 * Version: 1.0
 */


using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using CMS.Backend.Models;

namespace CMS.Backend.Controllers;

public class HomeController : Controller
{
    public IActionResult Index()
    {
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
