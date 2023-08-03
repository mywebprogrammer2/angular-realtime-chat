import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RolesService } from 'src/app/dashboard/services/roles.service';
import { Subscription } from "rxjs"

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit{

  @ViewChild('CreateForm') CreateForm : NgForm;
  public errorMessage : string;
  public successMessage : string;
  public requesting : boolean;
  public permissions: any[];
  public createSubscription : Subscription;
  errors: any = {};

  constructor(private rolesService: RolesService) {
    this.loadPermissions();

  }

  ngOnInit(){
  }

  loadPermissions(){
    this.rolesService.fetchPermissions().subscribe({
      next: (data) => {
        const permissions = [];

        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const module = data[key];
            const permissionsArray = [];

            for (const item of module) {
              const permissionName = item.name.replace('-', ' ');
              const displayName = permissionName.charAt(0).toUpperCase() + permissionName.slice(1);

              permissionsArray.push({
                name: item.name,
                displayName: displayName,
                checked: false // Set initial checkbox state as unchecked
              });
            }

            permissions.push({
              key: key.charAt(0).toUpperCase() + key.slice(1),
              permissions: permissionsArray
            });
          }
        }

        this.permissions = permissions;
      },

      error: (data) =>{}
    })
  }



  create() {
    this.successMessage = "";
    this.errorMessage = "";
    this.requesting = true;

    this.createSubscription = this.rolesService.create(this.CreateForm.value).subscribe({
      next: (role) => {
        this.successMessage += "Role created successfully";
        this.CreateForm.resetForm()
      },
      error: (err) => {
        this.requesting = false
        if(err.errors)
          this.errors = err.errors;
          console.log("🚀 ~ file: create.component.ts:80 ~ CreateComponent ~ this.createSubscription=this.rolesService.create ~ this.errors:", this.errors)
        if (err.message)
          this.errorMessage = err.message
      },
      complete: () => {this.requesting = false}
    })
  }

  ngOnDestroy() {
    if(this.createSubscription) this.createSubscription.unsubscribe();
  }
}
