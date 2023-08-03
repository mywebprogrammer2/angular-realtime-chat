import { NgModule } from "@angular/core";
import { UsersComponent } from "./users.component";
import { UserRoutingModule } from "./users-routing.module";
import { DashboardSharedModule } from "../../shared/shared.module";
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    UsersComponent,
    CreateComponent,
    EditComponent
  ],
  imports: [
    UserRoutingModule,
    ReactiveFormsModule,
    DashboardSharedModule
  ],
})
export class UserModule { }
