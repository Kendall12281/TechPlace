import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'modal-1',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class modalComponent {
  constructor(public dialogRef: MatDialogRef<modalComponent>) { }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
