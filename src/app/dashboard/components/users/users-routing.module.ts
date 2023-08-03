import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { PermissionsGuard } from 'src/app/auth/guards/permissions.guard';

const routes: Routes = [
  { path: '', component:UsersComponent},
  {
    path: 'create',
    component:CreateComponent,
    data: {permission: 'user-create'},
    canActivate:[PermissionsGuard]
  },
  {
    path: 'edit/:id',
    component:EditComponent,
    data: {permission: 'user-edit'},
    canActivate:[PermissionsGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
