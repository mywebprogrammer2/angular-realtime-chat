import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Role } from 'src/app/dashboard/models/role.model';
import { User } from 'src/app/dashboard/models/user.model';
import { RolesService } from 'src/app/dashboard/services/roles.service';
import { UserService } from 'src/app/dashboard/services/user.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {

  public showPassword : boolean = false;
  @ViewChild('EditForm') EditForm : NgForm
  public errors?: any;
  public requesting : boolean;
  public updateSubscription : Subscription;
  public roleSubscription : Subscription;
  public userSubscription : Subscription;
  public roles: Role[]= [];
  public id = 0;
  public user: User | undefined ;


  constructor(private userService: UserService, private rolesService: RolesService,private route: ActivatedRoute,private router: Router){
    this.rolesService.fetchData();
    this.id = this.route.snapshot.params['id'];

  }

  ngOnInit(){
    this.getUser();
    this.getRoles();
  }

  getRoles(){
    this.roleSubscription = this.rolesService.getData.subscribe(data => {
      this.roles = data;
    })
  }

  getUser(){
    this.userSubscription = this.userService.getById(this.id).subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {},
      complete: () => {}
    })
  }



  update(){
    this.errors = [];
    this.requesting = true;

    if (this.EditForm.value.password == '') {
      delete this.EditForm.value.password;
    }

    this.updateSubscription = this.userService.update(this.id,this.EditForm.value).subscribe({
      next: (res) =>{
        this.router.navigate(['/dashboard','users'])
      },
      error: (err) =>{
        if (err.errors) this.errors = err.errors;
        console.log(err.message);
        this.requesting= false;

      },
      complete: () => {
        this.requesting= false;
      }
    })
  }


  ngOnDestroy(): void {
    this.roleSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    if (this.updateSubscription) this.updateSubscription.unsubscribe();
  }

}
