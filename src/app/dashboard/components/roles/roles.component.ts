import { Component,OnInit, OnDestroy } from '@angular/core';
import { RolesService } from '../../services/roles.service';
import { Role } from '../../models/role.model';
import { Subscription } from "rxjs"
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../../shared/components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit, OnDestroy {

  public roles: Role[] = []
  subscription: Subscription;
  deleteSubscription: Subscription;

  constructor(private rolesService: RolesService,public dialog: MatDialog,private permissionService: PermissionService) {
    this.rolesService.fetchData()
  }


  ngOnInit(): void {
    this.subscription = this.rolesService.getData.subscribe(data => {
        this.roles = data;
      })
  }

  can(permission:string):boolean { return this.permissionService.hasPermission(permission)}

  openDeleteConfirmationDialog(id:number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteRole(id)
      }
    });
  }

  deleteRole(id: number): void{
    this.deleteSubscription = this.rolesService.delete(id).subscribe({
      next: () => this.onDeleted(id),
      error: (error) => {},
      complete: () => {}

    })
  }

  onDeleted(id:number): void {
    const deleteItem = this.roles.find(x => x.id == id);
    if(deleteItem){
      this.rolesService.deleteLocally( deleteItem );
    }
  }



  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
  }

}
