import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Role } from 'src/app/dashboard/models/role.model';
import { RolesService } from 'src/app/dashboard/services/roles.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {

  @ViewChild('EditForm') EditForm: NgForm;
  public errorMessage: string;
  public requesting: boolean;
  public permissions: any[]
  public id = 0;
  public role: Role | undefined ;
  fetchRoleSubscription: Subscription;
  fetchPermissionSubscription: Subscription;
  updateRoleSubscription: Subscription;


  constructor(private rolesService: RolesService,private route: ActivatedRoute,private router: Router) {
    this.loadPermissions();

    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.route.params.subscribe((params: any)=>{
      this.id = params['id'];
      this.fetchRole();
    })
  }


  fetchRole(id = this.id){
    this.fetchRoleSubscription = this.rolesService.getById(id).subscribe({
      next: (data)=>{
        this.role = data;
      }
    })
  }

  loadPermissions() {
    this.fetchPermissionSubscription = this.rolesService.fetchPermissions().subscribe({
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
                checked: this.role && this.role.permissions ? this.isChecked(item.name) : false, // Set initial checkbox state as unchecked
              });
            }

            permissions.push({
              key: key.charAt(0).toUpperCase() + key.slice(1),
              permissions: permissionsArray,
            });
          }
        }

        this.permissions = permissions;
      },

      error: (data) => {},
    });
  }

  isChecked(name:string){
    return this.role &&  this.role?.permissions &&  this.role?.permissions?.findIndex(x=>x.name == name ) > -1;
  }

  update() {
    this.errorMessage = '';
    this.requesting = true;


    this.updateRoleSubscription = this.rolesService.update(this.id,this.EditForm.value).subscribe({
      next: (role) => {
        this.router.navigate(['/dashboard','roles']);
      },
      error: (err) => {
        if (err.message) {
          this.errorMessage = err.message;
        }
        else if(err.errors && err.errors.name && err.errors.name instanceof Array) {
          this.errorMessage = err.errors.name[0]
        }
      },
      complete: () => {
        this.requesting = false;
      },
    });
  }


  ngOnDestroy() {
    this.fetchRoleSubscription.unsubscribe();
    this.fetchPermissionSubscription.unsubscribe();
    if(this.updateRoleSubscription){
      this.updateRoleSubscription.unsubscribe();
    }
  }
}
