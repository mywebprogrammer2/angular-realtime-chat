import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, } from '@angular/material/dialog';
import { ConfirmationDialogData } from '../../models/confirmation-dialog-data.model';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData) { }

  confirm(): void {
    // Perform operation
    // ...
    this.dialogRef.close(true); // Close the dialog and pass the result
  }

  cancel(): void {
    this.dialogRef.close(false); // Close the dialog
  }
}
