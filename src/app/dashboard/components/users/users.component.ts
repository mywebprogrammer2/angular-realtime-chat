import { Component,OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Subscription } from "rxjs";
import { DeleteConfirmationDialogComponent } from '../../shared/components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PermissionService } from '../../services/permission.service';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-dashboard-user',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public users: User[] = [];
  subscriptions: Subscription;
  deleteSubscription: Subscription;


  constructor(private userService: UserService,public dialog: MatDialog, private permissionService: PermissionService) {
    userService.fetchData()
  }

  ngOnInit() {
    this.loadUsers();
  }

  can(permission:string):boolean { return this.permissionService.hasPermission(permission)}

  loadUsers() {
    this.subscriptions = this.userService.getData.subscribe(data => {
      this.users = data
    })
  }

  openDeleteConfirmationDialog(id:number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUser(id)
      }
    });
  }

  deleteUser(id:number){
    this.deleteSubscription = this.userService.delete(id).subscribe({
      next: () => this.onDeleted(id),
      error: (error) => {},
      complete: () => {}

    })
  }

  onDeleted(id:number): void {
    const deleteItem = this.users.find(x => x.id == id);
    if(deleteItem){
      this.userService.deleteLocally( deleteItem );
    }
  }

  deactivate(user: User){

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Confirm Deactivation',
        message: 'Are you sure you want to deactivate user account?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deactivate(user.id).subscribe({
          next: (data)=>{
            this.userService.updateLocally(data,(item) => item.id)
          },
          error: (error)=>{
            console.log('error',error)
          },
        });
      }
    });



  }

  activate(user: User){

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Confirm Activation',
        message: 'Are you sure you want to activate user account?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.activate(user.id).subscribe({
          next: (data)=>{
            this.userService.updateLocally(data,(item) => item.id)
          },
          error: (error)=>{
            console.log('error',error)
          },
        });
      }
    });

  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    if(this.deleteSubscription) this.deleteSubscription.unsubscribe();
  }
}
