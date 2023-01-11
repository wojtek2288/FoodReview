import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from 'rxjs';
import { tap } from "rxjs/operators";
import { AuthService } from './auth.service';

@Injectable()
export class LoggedInGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authService.isUserLoggedIn$.pipe(
            tap(x => {
                if (!x) {
                    this.router.navigate(['/login']);
                }
            }));
    }
}
