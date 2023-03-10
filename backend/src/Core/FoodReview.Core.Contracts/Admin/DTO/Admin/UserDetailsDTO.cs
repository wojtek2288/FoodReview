namespace FoodReview.Core.Contracts.Admin.DTO.Admin;

public class UserDetailsDTO
{
    public string Id { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public string ImageUrl { get; set; } = default!;
    public string Email { get; set; } = default!;
}