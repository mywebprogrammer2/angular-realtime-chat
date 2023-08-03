import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.css']
})
export class DeleteConfirmationDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>) { }

  confirmDelete(): void {
    // Perform delete operation
    // ...
    this.dialogRef.close(true); // Close the dialog and pass the result
  }

  cancelDelete(): void {
    this.dialogRef.close(false); // Close the dialog without deleting
  }
}
