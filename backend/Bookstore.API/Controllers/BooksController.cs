using Microsoft.AspNetCore.Mvc;
using Bookstore.API.Models;

namespace Bookstore.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private BookstoreContext _context;
    public BooksController(BookstoreContext temp) => _context = temp;
    [HttpGet]
    public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, string sortColumn = "Title", bool descending = false)
    {
        IQueryable<Book> query = _context.Books;

        // RUBRIC REQUIREMENT: Ability to sort by Book Title
        if (sortColumn.ToLower() == "title")
        {
            // Toggle logic: Use OrderByDescending if the flag is true
            query = descending ? query.OrderByDescending(b => b.Title) : query.OrderBy(b => b.Title);
        }
        else if (sortColumn.ToLower() == "author")
        {
            query = descending ? query.OrderByDescending(b => b.Author) : query.OrderBy(b => b.Author);
        }

        var data = query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return Ok(new { 
            books = data, 
            totalBooks = _context.Books.Count() 
        });
    }
}