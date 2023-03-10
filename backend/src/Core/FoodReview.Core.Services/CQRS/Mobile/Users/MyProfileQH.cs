using FoodReview.Core.Contracts.Common;
using FoodReview.Core.Contracts.Mobile.Users;
using FoodReview.Core.Services.CQRS.Common;
using FoodReview.Core.Services.DataAccess;
using Microsoft.EntityFrameworkCore;

namespace FoodReview.Core.Services.CQRS.Example;

public class MyProfileQH : QueryHandler<MyProfile, UserDetailsDTO>
{
    private readonly CoreDbContext dbContext;

    public MyProfileQH(CoreDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public override Task<UserDetailsDTO> HandleAsync(MyProfile query, CoreContext context)
    {
        return dbContext.Users
            .Where(u => u.Id == context.UserId)
            .Select(u => new UserDetailsDTO
            {
                Username = u.Username,
                Description = u.Description,
                ImageUrl = u.ImageUrl,
            })
            .FirstAsync(context.CancellationToken);
    }
}