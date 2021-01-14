import { Component } from '@angular/core';
import {SessionService} from './core/services/session.service';
import {AuthService} from './core/services/auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private sessionService: SessionService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  get isSignedIn(): boolean {
    return AuthService.isSignedIn;
  }

  signout() {
    // supprimer les données de sessions et retourner à la page de login
    this.router.navigate(['/auth/signin']).then(() => {
      this.sessionService.clear();
      AuthService.user = null;
      this.snackbar.open('déconnecté');
    });
  }

}
