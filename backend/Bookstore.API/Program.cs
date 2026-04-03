using Microsoft.EntityFrameworkCore;
using Bookstore.API.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Controllers
builder.Services.AddControllers();

// 2. Register the BookstoreContext with SQLite
builder.Services.AddDbContext<BookstoreContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection"));
});

// 3. Enable CORS (Cross-Origin Resource Sharing)
// This allows your React app (on port 5173) to talk to this API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy => policy.WithOrigins("http://localhost:5173", "https://wheelerbookstore-fehyb7gteadufee5.eastus-01.azurewebsites.net/")
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

// 4. Use the CORS policy
app.UseCors("AllowReact");

app.UseHttpsRedirection();
app.MapControllers();

app.Run();