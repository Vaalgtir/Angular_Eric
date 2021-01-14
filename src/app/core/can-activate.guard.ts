import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from './services/auth.service';
import {catchError, map} from 'rxjs/operators';
import {User} from './entities/user';
import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class CanActivateGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.me().pipe(

      // on regarde si on a un erreur de permission et on retourne le status de la requête
      catchError((error: Response) => {
        let status = 500;
        if (error.status === 401 || error.status === 403) { // unauthorized or forbidden //
          status = error.status;
          this.snackbar.open('Permission denied');
        }
        return of({ status });
      }),

      map((response: Response | User ) => {
        // on retourne true ou false en fonction du status ( et donc de la permission )
        if ('status' in response) {
          if (401 === response.status || 403 === response.status) {
            this.snackbar.open('Non connecté');
            this.router.navigate(['auth/signin']);
            return false;
          }
        // on vérifie que l'utilisateur est admin dans le cas où la router est dédiés à des admins
        } else if ( 'roles' in response ) {
          if (!response.roles.includes('ROLE_ADMIN') && ('admin' in next.data) ) {
            this.snackbar.open('Admin required');
            this.router.navigate(['auth/signin']);
            return false;
          }
          return true;
        }
      })
    );
  }

}


















