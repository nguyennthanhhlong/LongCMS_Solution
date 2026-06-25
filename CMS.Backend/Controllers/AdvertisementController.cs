using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data.Entities;
using CMS.Data;
using System.Linq;
using System.IO;
using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class AdvertisementController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AdvertisementController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index(int page = 1)
        {
            int pageSize = 10;
            var totalItems = _context.Advertisements.Count();
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var data = _context.Advertisements
                .OrderByDescending(a => a.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            ViewBag.CurrentPage = page;
            ViewBag.TotalPages = totalPages;

            return View(data);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(Advertisement model, IFormFile? uploadImage)
        {
            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }
                model.ImageUrl = "/uploads/" + fileName;
            }

            ModelState.Remove("ImageUrl");

            // Kiểm tra trùng lặp SortOrder
            bool checkSort = _context.Advertisements.Any(a => a.SortOrder == model.SortOrder);
            if (checkSort)
            {
                ModelState.AddModelError("SortOrder", "Vị trí sắp xếp này đã có hình ảnh khác sử dụng! Vui lòng chọn số khác.");
            }

            if (ModelState.IsValid)
            {
                _context.Advertisements.Add(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(model);
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var ad = _context.Advertisements.Find(id);
            if (ad == null) return NotFound();
            return View(ad);
        }

        [HttpPost]
        public IActionResult Edit(Advertisement model, IFormFile? uploadImage)
        {
            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }
                model.ImageUrl = "/uploads/" + fileName;
            }
            else
            {
                var oldAd = _context.Advertisements.AsNoTracking().FirstOrDefault(a => a.Id == model.Id);
                if (oldAd != null && string.IsNullOrEmpty(model.ImageUrl))
                {
                    model.ImageUrl = oldAd.ImageUrl;
                }
            }

            ModelState.Remove("ImageUrl");

            // Kiểm tra trùng lặp SortOrder (loại trừ chính nó)
            bool checkSort = _context.Advertisements.Any(a => a.SortOrder == model.SortOrder && a.Id != model.Id);
            if (checkSort)
            {
                ModelState.AddModelError("SortOrder", "Vị trí sắp xếp này đã có hình ảnh khác sử dụng! Vui lòng chọn số khác.");
            }

            if (ModelState.IsValid)
            {
                _context.Advertisements.Update(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }

            // Debug errors
            foreach (var state in ModelState)
            {
                foreach (var error in state.Value.Errors)
                {
                    Console.WriteLine($"[DEBUG MODELSTATE ERROR] Key: {state.Key}, Error: {error.ErrorMessage}");
                }
            }

            return View(model);
        }

        public IActionResult Delete(int id)
        {
            var ad = _context.Advertisements.Find(id);
            if (ad != null)
            {
                _context.Advertisements.Remove(ad);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}
