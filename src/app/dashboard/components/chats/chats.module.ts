import { NgModule } from '@angular/core';
import { ChatsComponent } from './chats.component';
import { ListItemComponent } from './components/list-item/list-item.component';
import { SendFormComponent } from './components/send-form/send-form.component';
import { ModalsComponent } from './components/modals/modals.component';
import { DashboardSharedModule } from '../../shared/shared.module';
import { ChatsRoutingModule } from './chats-routing.module';
import { ContactListComponent } from './components/contact-list/contact-list.component';
import { MessageCardComponent } from './components/message-card/message-card.component';



@NgModule({
  declarations: [
    ChatsComponent,
    ListItemComponent,
    SendFormComponent,
    ModalsComponent,
    ContactListComponent,
    MessageCardComponent,
  ],
  imports: [
    ChatsRoutingModule,
    DashboardSharedModule,
  ]
})
export class ChatsModule { }
