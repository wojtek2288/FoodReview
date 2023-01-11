using FoodReview.Core.Contracts.Admin.DTO.Admin;
using FoodReview.Core.Contracts.Admin.Restaurants;
using FoodReview.Core.Contracts.Common;
using Microsoft.AspNetCore.Authorization;

namespace FoodReview.Core.Contracts.Admin.Users;

[Authorize(Roles = Auth.Roles.Admin)]
public class UserDetails: QueryBase<UserDetails, UserDetailsDTO>
{
    public string Id { get; set; }

    public static class ErrorCodes
    {
        public const int UserDoesNotExist = 1;
    }
}