import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesComponent } from './roles.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { authGuard } from 'src/app/auth/guards/auth.guard';
import { PermissionsGuard } from 'src/app/auth/guards/permissions.guard';

const routes: Routes = [
  { path: '', component:RolesComponent},
  {
    path: 'create',
    component:CreateComponent,
    data: { permission: 'role-create'},
    canActivate: [PermissionsGuard],
  },
  {
    path: 'edit/:id',
    component:EditComponent,
    data: { permission: 'role-edit'},
    canActivate: [PermissionsGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
