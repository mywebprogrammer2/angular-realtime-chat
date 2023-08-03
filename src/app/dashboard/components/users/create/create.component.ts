import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { UserService } from 'src/app/dashboard/services/user.service';
import { Subscription } from "rxjs"
import { RolesService } from 'src/app/dashboard/services/roles.service';
import { Role } from 'src/app/dashboard/models/role.model';

@Component({
  selector: 'app-dashboard-users-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {

  public showPassword : boolean = false;
  @ViewChild('form',{static: true}) form : NgForm
  public errors?: any;
  public requesting : boolean;
  public createSubscription : Subscription;
  public roleSubscription : Subscription;
  public roles: Role[]= [];
  userCreateForm: FormGroup;


  constructor(private userService: UserService, private rolesService: RolesService,private formBuilder: FormBuilder){
    this.rolesService.fetchData();
    this.userService.fetchData();


    this.userCreateForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,Validators.minLength(8)]],
      role: ['', Validators.required]
    });
  }

  ngOnInit(){
    this.getRoles();
  }

  getRoles(){
    this.roleSubscription = this.rolesService.getData.subscribe(data => {
      this.roles = data;
    })
  }


  create(){
    this.errors = [];
    this.requesting = true;

    this.createSubscription = this.userService.create(this.userCreateForm.value).subscribe({
      next: (user) => {
        this.userCreateForm.reset();
        this.form.resetForm();
      },
      error: (err) => {
        if (err.errors)
          this.errors = err.errors
      },
      complete: () => {this.requesting = false}
    })
  }


  ngOnDestroy() {
    if(this.createSubscription) this.createSubscription.unsubscribe();
    if(this.roleSubscription) this.roleSubscription.unsubscribe();
  }
}
