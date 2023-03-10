export interface Review {
    id: string,
    userId: string,
    username: string,
    restaurantId: string,
    restaurantName: string,
    dishId: string | undefined,
    dishName: string | undefined,
    rating: number,
    description: string
}