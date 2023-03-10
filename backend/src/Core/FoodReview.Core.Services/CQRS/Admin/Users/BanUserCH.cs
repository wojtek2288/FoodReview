using FluentValidation;
using FoodReview.Core.Contracts.Admin.Users;
using FoodReview.Core.Contracts.Common;
using FoodReview.Core.Domain;
using FoodReview.Core.Services.CQRS.Common;
using FoodReview.Core.Services.CQRS.Extensions;
using FoodReview.Core.Services.DataAccess;
using FoodReview.Core.Services.DataAccess.Entities;
using FoodReview.Core.Services.DataAccess.Repositories;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FoodReview.Core.Services.CQRS.Admin.Users;

public class BanUserCV : AbstractValidator<CommandRequest<BanUser, Unit>>
{
    private readonly CoreDbContext dbContext;

    public BanUserCV(CoreDbContext dbContext)
    {
        this.dbContext = dbContext;

        RuleFor(x => x)
            .MustAsync(async (x, cancellation) => 
            {
                var userExists = await dbContext.Users
                    .Where(x => !x.IsBanned)
                    .AnyAsync(r => r.Id.ToString() == x.Command.Id, x.Context.CancellationToken);
        
                return userExists;
            })
            .WithCode(BanUser.ErrorCodes.UserDoesNotExist)
            .WithMessage("User with specified Id does not exist.");
    }
}

public class BanUserCH : CommandHandler<BanUser>
{
    private readonly UserManager<AuthUser> userManager;
    private readonly Repository<User> users;

    public BanUserCH(Repository<User> users, UserManager<AuthUser> userManager)
    {
        this.users = users;
        this.userManager = userManager;
    }

    public override async Task HandleAsync(BanUser command, CoreContext context)
    {
        var user = await users.FindAndEnsureExistsAsync(Guid.Parse(command.Id), context.CancellationToken);
        var authUser = await userManager.FindByIdAsync(command.Id);

        user.Ban();
        await users.SaveChangesAsync();
        if (authUser != null)
        {
            authUser.LockoutEnd = DateTimeOffset.MaxValue;
            await userManager.UpdateAsync(authUser);
        }
    }
}