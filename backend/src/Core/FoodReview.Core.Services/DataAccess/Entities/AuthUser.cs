using Microsoft.AspNetCore.Identity;

namespace FoodReview.Core.Services.DataAccess.Entities;

public class AuthUser : IdentityUser<Guid>
{
    public virtual List<IdentityUserClaim<Guid>> Claims { get; } = new List<IdentityUserClaim<Guid>>();
}
