import { Component } from '@angular/core';
import { AuthService } from '../../services/authService.service';
import { StorageService } from 'src/app/services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string;
  password: string;
  errorMessage: string;

  constructor(private authService: AuthService,private storageService: StorageService,private router: Router) {

  }


  login() {
    this.errorMessage = "";
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => this.logged_in(response),
      error: (error) => {
        if (!error.success) {
          this.errorMessage = error.message;
        }
      }
    });
  }

  logged_in(data:any) {
    this.storageService.write('access_token', data.access_token)
    this.storageService.write('user', data.user)
    this.storageService.write('token_type', data.token_type);
    this.router.navigate(["dashboard"]);
  }
}
