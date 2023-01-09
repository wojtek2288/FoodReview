import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthService } from "../main/auth/auth.service";
import { ConfirmationDialogComponent } from "../main/confirmation-dialog/confirmation-dialog.component";
import { EditDetailsDialogComponent } from "../main/edit-details-dialog/edit-details-dialog.component";
import { Restaurant } from "../restaurants/model/restaurant.interface";
import { ApiService } from "./api.service";
import { PaginatedQueryCriteria } from "./model/paginated-query-criteria";
import { PaginatedQueryResult } from "./model/paginated-query-results";
import { RestaurantDetails } from "./model/restaurant-details";

@Injectable({
    providedIn: "root",
})
export class RestaurantApiService {
    private isLoadingSubject = new Subject<boolean>();
    public isLoading$ = this.isLoadingSubject.asObservable();
    private restaurantsSubject = new Subject<PaginatedQueryResult<Restaurant>>();
    public restaurants$ = this.restaurantsSubject.asObservable();
    private restaurantDetailsSubject = new Subject<RestaurantDetails>();
    public restaurantDetails$ = this.restaurantDetailsSubject.asObservable();
    private afterCommandFinishedSubject = new Subject<void>();
    public afterCommandFinished$ = this.afterCommandFinishedSubject.asObservable();

    constructor(private apiService: ApiService, private authService: AuthService, private dialog: MatDialog, private snackBar: MatSnackBar, private router: Router) {}

    public getRestaurants(criteria: PaginatedQueryCriteria)
    {
        this.isLoadingSubject.next(true);
        this.apiService.getRestaurants(criteria, this.authService.loggedInUser?.access_token!).subscribe(x => 
        {
            this.restaurantsSubject.next(x);
            this.isLoadingSubject.next(false);
        });
    }

    public getRestaurantDetails(id: string): void {
        this.isLoadingSubject.next(true);
        this.apiService.getRestaurantDetails({
          id: id
        }, this.authService.loggedInUser?.access_token!).subscribe(x => 
          {
            this.restaurantDetailsSubject.next(x);
            this.isLoadingSubject.next(false);
          }, x => {
          this.snackBar.open("Restaurant with specified Id does not exist", "", {duration: 3000});
          this.router.navigate(['']);
        });
    }

    public addRestaurant(): void {
      const dialogRef = this.dialog.open(EditDetailsDialogComponent, {
        data: {
          name: "",
          description: "",
          imageUrl: ""
        },
        width: "500px"
      });
      dialogRef.afterClosed().subscribe(x => {
        if (x)
        {
          this.isLoadingSubject.next(true);
          console.log(x);
          return;
          // this.apiService.deleteRestaurant({
          //   id: id
          // }, this.authService.loggedInUser?.access_token!).subscribe(
          //   _ => {
          //     this.snackBar.open("Successfuly deleted restaurant", "", {duration: 3000});
          //     this.afterCommandFinishedSubject.next();
          //   },
          //   x => this.snackBar.open("Restaurant with specified Id does not exist", "", {duration: 3000})
          // );
        }
      });
    }

    public editRestaurant(data: Restaurant): void {
      const dialogRef = this.dialog.open(EditDetailsDialogComponent, {
        data: {...data},
        width: "500px"
      });
      dialogRef.afterClosed().subscribe(x => {
        if (x)
        {
          this.isLoadingSubject.next(true);
          console.log(x);
          return;
          // this.apiService.deleteRestaurant({
          //   id: id
          // }, this.authService.loggedInUser?.access_token!).subscribe(
          //   _ => {
          //     this.snackBar.open("Successfuly deleted restaurant", "", {duration: 3000});
          //     this.afterCommandFinishedSubject.next();
          //   },
          //   x => this.snackBar.open("Restaurant with specified Id does not exist", "", {duration: 3000})
          // );
        }
      });
    }
    
    public deleteRestaurant(id: string): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent);
        dialogRef.afterClosed().subscribe(x => {
          if (x)
          {
            this.isLoadingSubject.next(true);
            this.apiService.deleteRestaurant({
              id: id
            }, this.authService.loggedInUser?.access_token!).subscribe(
              _ => {
                this.snackBar.open("Successfuly deleted restaurant", "", {duration: 3000});
                this.afterCommandFinishedSubject.next();
              },
              x => this.snackBar.open("Restaurant with specified Id does not exist", "", {duration: 3000})
            );
          }
        });
    }

    public toggleRestaurantVisibility(id: string): void {
        this.isLoadingSubject.next(true);
        this.apiService.toggleRestaurantVisibility({
            id: id
        }, this.authService.loggedInUser?.access_token!).subscribe(
        _ => {
          this.snackBar.open("Successfuly changed visibility", "", {duration: 3000});
          this.afterCommandFinishedSubject.next();
        },
        x => this.snackBar.open("Restaurant with specified Id does not exist", "", {duration: 3000})
      );
    }
}