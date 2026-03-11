using System.ComponentModel.DataAnnotations;

namespace Bookstore.API.Models;

public class Book
{
    [Key]
    public int BookID { get; set; } // Matches "BookID" in SQLite 
    [Required]
    public required string Title { get; set; }
    [Required]
    public required string Author { get; set; }
// ... and so on for the other strings    [Required]
    [Required]
    public string Publisher { get; set; } 
    [Required]
    public string ISBN { get; set; } 
    [Required]
    public string Classification { get; set; } 
    [Required]
    public string Category { get; set; }
    [Required]
    public int PageCount { get; set; } 
    [Required]
    public double Price { get; set; }
}