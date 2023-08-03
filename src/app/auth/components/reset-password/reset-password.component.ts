import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/authService.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
  errorMessage: string;
  successMessage: string;
  requesting:boolean = false;
  subscription: Subscription;
  showPassword: boolean = false;

  public errors: any = {};

  constructor(private route: ActivatedRoute,private authService: AuthService,private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.token = params['token'];
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  resetPassword() {

    this.errorMessage = "";
    this.errors = {};
    this.successMessage = "";
    this.requesting = true;

    // Reset password logic here
    // Validate new password and confirm password
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = "Passwords do not match.";
      return;
    }
    const data = {
      email: this.email,
      token: this.token,
      password: this.newPassword,
      password_confirmation: this.confirmPassword,
    }

    this.subscription = this.authService.resetPassword(data).subscribe({
      next: (value) => {
          this.successMessage = value.message;
          this.router.navigate(['/'])
      },
      error: (error) => {
        this.errorMessage = error.message;

      },
      complete:() => {
          this.requesting = true;
      },
    })

  }

  ngOnDestroy() {
    if(this.subscription) this.subscription.unsubscribe();
  }
}
