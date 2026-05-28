using Microsoft.EntityFrameworkCore;
using CMS.Data;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// ==============================================================
// 1. KHU VỰC ĐĂNG KÝ DỊCH VỤ (SERVICES CONTAINER)
// ==============================================================
builder.Services.AddControllersWithViews(); // Hỗ trợ cả MVC (View) và Web API

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Kích hoạt bộ sinh tài liệu API (Swagger)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Khai báo chính sách CORS (Cho phép ReactJS gọi API)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

// Đăng ký dịch vụ xác thực bằng Cookie
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login"; // Chuyển hướng về đây nếu chưa đăng nhập
        options.AccessDeniedPath = "/Account/AccessDenied"; // Chuyển hướng về đây nếu sai quyền (Role)
    });


var app = builder.Build();

app.UseStaticFiles();

// Kích hoạt giao diện Swagger
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ThaiCMS Web API v1");
    c.RoutePrefix = "swagger"; // Đường dẫn truy cập: /swagger
});

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseCors("AllowAll");

app.UseAuthentication(); // THÊM DÒNG NÀY (Xác thực)

app.UseAuthorization();

app.MapStaticAssets();

// ===============================================================
// 3. KHU VỰC ĐỊNH TUYẾN PHÂN LUỒNG (ROUTING MAP)
// ===============================================================

// Phân luồng A: Ánh xạ các API Controller
app.MapControllers();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();


app.Run();
