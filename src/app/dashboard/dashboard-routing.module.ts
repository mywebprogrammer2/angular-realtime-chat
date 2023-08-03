import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component:DashboardComponent,
    children: [
      {
        path: "users",
        canActivate: [PermissionsGuard],
        data:{permission: 'user-view'},
        loadChildren: () => import("./components/users/users.module").then((x) =>x.UserModule),
      },
      {
        path: "roles",
        canActivate: [PermissionsGuard],
        data:{permission: 'role-view'},
        loadChildren: () => import("./components/roles/roles.module").then((x) => x.RolesModule),
      },
      {
        path: 'chats',
        loadChildren: () => import("./components/chats/chats.module").then((x) => x.ChatsModule),
      },
      {
        path: "change-password",
        component: ChangePasswordComponent
      }
    ]
  },
];





@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
