import { Component } from '@angular/core';
import { AuthService } from '../../services/authService.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string;
  errorMessage: string;
  successMessage: string;

  constructor(private authService: AuthService) {}

  resetPassword() {
    this.authService.forgotPassword({'email':this.email}).subscribe({
      next:(value) => {
        this.successMessage = "Reset link sent to your email address.";

      },
      error:(err) => {
        this.errorMessage = err.message;
      },
    })
  }
}
