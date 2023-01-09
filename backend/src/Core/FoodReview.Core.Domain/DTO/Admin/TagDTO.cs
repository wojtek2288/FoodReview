namespace FoodReview.Core.Domain.DTO.Admin;

public class TagDTO
{
    public Guid Id { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string ColorHex { get; set; } = default!;
}