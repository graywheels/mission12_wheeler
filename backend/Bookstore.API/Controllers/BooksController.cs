using Microsoft.AspNetCore.Mvc;
using Bookstore.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Bookstore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private BookstoreContext _context;
    public BooksController(BookstoreContext temp) => _context = temp;

    [HttpGet]
    public IActionResult GetBooks(string? category, int pageSize = 5, int pageNum = 1, string sortColumn = "Title", bool descending = false)
    {
        // Use IQueryable to build the query piece-by-piece
        IQueryable<Book> query = _context.Books;

        // 1. Filtering by Category
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(b => b.Category == category);
        }

        // 2. Sorting Logic
        if (sortColumn.ToLower() == "title")
        {
            query = descending ? query.OrderByDescending(b => b.Title) : query.OrderBy(b => b.Title);
        }
        else if (sortColumn.ToLower() == "author")
        {
            query = descending ? query.OrderByDescending(b => b.Author) : query.OrderBy(b => b.Author);
        }

        // 3. Get total count of FILTERED items for pagination
        int totalItems = query.Count();

        // 4. Pagination
        var data = query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return Ok(new { 
            books = data, 
            totalBooks = totalItems 
        });
    }

    // New endpoint to populate the Category Filter sidebar
    [HttpGet("categories")]
    public IActionResult GetCategories()
    {
        var categories = _context.Books
            .Select(x => x.Category)
            .Distinct()
            .OrderBy(x => x)
            .ToList();
        return Ok(categories);
    }
}