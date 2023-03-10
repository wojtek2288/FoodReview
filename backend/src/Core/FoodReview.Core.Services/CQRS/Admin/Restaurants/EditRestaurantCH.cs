using FluentValidation;
using FoodReview.Core.Contracts.Admin.Restaurants;
using FoodReview.Core.Contracts.Common;
using FoodReview.Core.Domain;
using FoodReview.Core.Services.CQRS.Common;
using FoodReview.Core.Services.CQRS.Extensions;
using FoodReview.Core.Services.DataAccess;
using FoodReview.Core.Services.DataAccess.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FoodReview.Core.Services.CQRS.Admin.Restaurants;

public class EditRestaurantCV : AbstractValidator<CommandRequest<EditRestaurant, Unit>>
{
    private readonly CoreDbContext dbContext;

    public EditRestaurantCV(CoreDbContext dbContext)
    {
        this.dbContext = dbContext;
        
        RuleFor(x => x)
            .MustAsync(async (x, cancellation) => 
            {
                var restaurantExists = await dbContext.Restaurants
                    .AnyAsync(r => r.Id.ToString() == x.Command.Id, x.Context.CancellationToken);
        
                return restaurantExists;
            })
            .WithCode(EditRestaurant.ErrorCodes.RestaurantDoesNotExist)
            .WithMessage("Restaurant with specified Id does not exist.");

        RuleFor(x => x.Command.Name)
            .NotEmpty()
                .WithCode(EditRestaurant.ErrorCodes.NameIsEmpty)
                .WithMessage("Name must not be empty.")
            .MaximumLength(StringLengths.ShortString)
                .WithCode(EditRestaurant.ErrorCodes.NameTooLong)
                .WithMessage("Name is too long.");

        RuleFor(x => x.Command.Description)
            .MaximumLength(StringLengths.MediumString)
                .WithCode(EditRestaurant.ErrorCodes.DescriptionTooLong)
                .WithMessage("Description is too long.")
            .When(e => e.Command.Description is not null);

        RuleFor(x => x.Command.ImageUrl)
            .NotEmpty()
                .WithCode(EditRestaurant.ErrorCodes.ImageLinkEmpty)
                .WithMessage("ImageLink must not be empty.")
            .MaximumLength(StringLengths.LinkString)
                .WithCode(EditRestaurant.ErrorCodes.ImageLinkTooLong)
                .WithMessage("ImageLink too long.");
        
        RuleFor(x => x)
            .Must((x, cancellation) =>
            {
                var tagsFound = x.Command.Tags.Distinct()
                    .Count(y => this.dbContext.Tags.SingleOrDefault(z => z.Id.ToString() == y) != null);
        
                return tagsFound == x.Command.Tags.Count;
            })
            .WithCode(EditRestaurant.ErrorCodes.InvalidTagIdList)
            .WithMessage("Invalid list of tag IDs.");
    }
}

public class EditRestaurantCH : CommandHandler<EditRestaurant>
{
    private readonly Repository<Restaurant> restaurants;
    private readonly CoreDbContext dbContext;

    public EditRestaurantCH(Repository<Restaurant> restaurants, CoreDbContext dbContext)
    {
        this.restaurants = restaurants;
        this.dbContext = dbContext;
    }

    public override async Task HandleAsync(EditRestaurant command, CoreContext context)
    {
        var restaurant = await dbContext.Restaurants.Include(x => x.Tags)
            .SingleAsync(x => command.Id == x.Id.ToString());
        
        restaurant.Edit(
            command.Name,
            command.Description,
            command.ImageUrl);
        var tags = await dbContext.Tags.Where(x => command.Tags.Contains(x.Id.ToString())).ToListAsync();
        restaurant.Tags = tags;

        await dbContext.SaveChangesAsync();
    }
}