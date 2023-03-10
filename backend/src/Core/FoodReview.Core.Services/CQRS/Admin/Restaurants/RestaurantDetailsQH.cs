using FluentValidation;
using FoodReview.Core.Contracts.Admin.DTO.Admin;
using FoodReview.Core.Contracts.Admin.Restaurants;
using FoodReview.Core.Contracts.Common;
using FoodReview.Core.Contracts.Shared;
using FoodReview.Core.Domain;
using FoodReview.Core.Services.CQRS.Common;
using FoodReview.Core.Services.CQRS.Extensions;
using FoodReview.Core.Services.DataAccess;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TagDTO = FoodReview.Core.Contracts.Admin.DTO.Admin.TagDTO;

namespace FoodReview.Core.Services.CQRS.Admin.Restaurants;

public class RestaurantDetailsQV : AbstractValidator<QueryRequest<RestaurantDetails, RestaurantDetailsDTO>>
{
    private readonly CoreDbContext dbContext;

    public RestaurantDetailsQV(CoreDbContext dbContext)
    {
        this.dbContext = dbContext;
        
        RuleFor(x => x)
            .MustAsync(async (x, cancellation) => 
            {
                var restaurantExists = await dbContext.Restaurants
                    .AnyAsync(r => r.Id.ToString() == x.Query.Id, x.Context.CancellationToken);
        
                return restaurantExists;
            })
            .WithCode(RestaurantDetails.ErrorCodes.RestaurantDoesNotExist)
            .WithMessage("Restaurant with specified Id does not exist.");
    }
}

public class RestaurantDetailsQH : QueryHandler<RestaurantDetails, RestaurantDetailsDTO>
{
    private readonly CoreDbContext dbContext;

    public RestaurantDetailsQH(CoreDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public override async Task<RestaurantDetailsDTO> HandleAsync(RestaurantDetails query, CoreContext context)
    {
        var restaurant = await dbContext.Restaurants.Include(x => x.Tags)
            .SingleAsync(x => x.Id.ToString() == query.Id);

        return new RestaurantDetailsDTO
        {
            Id = restaurant.Id.ToString(),
            Name = restaurant.Name,
            ImageUrl = restaurant.ImageUrl,
            Description = restaurant.Description,
            IsVisible = restaurant.IsVisible,            
            Tags = restaurant.Tags.Select(x => new TagDTO
            {
                Id = x.Id,
                Name = x.Name,
                ColorHex = x.ColorHex
            }).ToList()
        };
    }
}