import { Component,ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/authService.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  showPassword: boolean = false;
  requesting: boolean = false;
  errors: any = {};
  errorMessage: string = '';
  successMessage: string = '';
  @ViewChild('changePasswordForm') changePasswordForm: NgForm
  subscriptions: Subscription;

  constructor(private authService: AuthService) {}

  update(): void {
    this.successMessage= '';
    this.errorMessage= '';
    this.requesting = true;


    this.subscriptions = this.authService.changePassword(this.changePasswordForm.value).subscribe({
      next: (response) => {
        this.successMessage = "Password has been changed successfully.";
        this.changePasswordForm.reset();
      },
      error: (error: any) => {
        this.errorMessage = error.message;
        this.errors = error.errors;
        this.requesting = false;
      },
      complete: () => {
        this.requesting = false;
      }
    })

  }

  ngOnDestroy(): void {
    if(this.subscriptions) this.subscriptions.unsubscribe();
  }
}
