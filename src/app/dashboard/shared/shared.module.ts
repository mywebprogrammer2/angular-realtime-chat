import { NgModule } from '@angular/core';
import { SHARED_MODULES } from '../models/SharedModules';
import { DeleteConfirmationDialogComponent } from './components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';


@NgModule({
  declarations: [

    DeleteConfirmationDialogComponent,
    ConfirmationDialogComponent

  ],
  imports: [
    ...SHARED_MODULES
  ],
  exports: [
    ...SHARED_MODULES
  ]
})
export class DashboardSharedModule { }
