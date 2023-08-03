import { NgModule } from "@angular/core";
import { RolesRoutingModule } from "./roles-routing.module";
import { DashboardSharedModule } from "../../shared/shared.module";
import { RolesComponent } from "./roles.component";
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
  declarations: [
    RolesComponent,
    CreateComponent,
    EditComponent,
  ],
  imports: [
    RolesRoutingModule,
    DashboardSharedModule,
  ],
})
export class RolesModule { }
