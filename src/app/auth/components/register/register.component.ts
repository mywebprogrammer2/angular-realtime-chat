import { Component } from '@angular/core';
import { AuthService } from '../../services/authService.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  errorMessage: string;
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  register() {
    this.errorMessage = "";

    if (this.password !== this.password_confirmation) {
      this.errorMessage = "Passwords do not match.";
      return;
    }

    this.authService.register({ name: this.name, email: this.email, password: this.password,password_confirmation: this.password_confirmation }).subscribe({
      next :(response) => {
        // Handle successful registration
        this.router.navigate(["/"]);
      },
      error: (error) => {
        // Handle registration error
        this.errorMessage = error.message;
      }
  });
  }
}
