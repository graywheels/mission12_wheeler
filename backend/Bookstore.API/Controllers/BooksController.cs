using System.Linq;
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
        IQueryable<Book> query = _context.Books;

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(b => b.Category == category);
        }

        if (sortColumn.ToLower() == "title")
        {
            query = descending ? query.OrderByDescending(b => b.Title) : query.OrderBy(b => b.Title);
        }
        else if (sortColumn.ToLower() == "author")
        {
            query = descending ? query.OrderByDescending(b => b.Author) : query.OrderBy(b => b.Author);
        }

        int totalItems = query.Count();

        var data = query
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return Ok(new { 
            books = data, 
            totalBooks = totalItems 
        });
    }

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

    // NEW: Create - Add a new book
    [HttpPost]
    public IActionResult AddBook([FromBody] Book newBook)
    {
        // [FromBody] ensures the JSON from React is mapped to the Book object
        _context.Books.Add(newBook);
        _context.SaveChanges();
        return Ok(newBook);
    }

    // NEW: Update - Edit an existing book
    [HttpPut("{id}")]
    public IActionResult UpdateBook(int id, [FromBody] Book updatedBook)
    {
        var existingBook = _context.Books.Find(id);
        
        if (existingBook == null)
        {
            return NotFound("Book not found"); // Standard error handling
        }

        // Overwrite the existing record with the new data
        existingBook.Title = updatedBook.Title;
        existingBook.Author = updatedBook.Author;
        existingBook.Publisher = updatedBook.Publisher;
        existingBook.ISBN = updatedBook.ISBN;
        existingBook.Classification = updatedBook.Classification;
        existingBook.Category = updatedBook.Category;
        existingBook.PageCount = updatedBook.PageCount;
        existingBook.Price = updatedBook.Price;

        _context.SaveChanges();
        return Ok(existingBook);
    }

    // NEW: Delete - Remove a book
    [HttpDelete("{id}")]
    public IActionResult DeleteBook(int id)
    {
        var book = _context.Books.Find(id);
        
        if (book == null)
        {
            return NotFound("Book not found");
        }

        _context.Books.Remove(book);
        _context.SaveChanges();
        
        return NoContent(); // Returns 204 success code with no body
    }
}