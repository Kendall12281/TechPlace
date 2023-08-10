import { Component, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private dialog: MatDialog) { }

  openErrorDialog(): MatDialogRef<ModalError> {
    return this.dialog.open(ModalError, {
    });
  }

  openSuccessDialog(): MatDialogRef<ModalCorrecto> {
    return this.dialog.open(ModalCorrecto, {
    });
  }
}

@Component({
    selector: 'dialog-elements-example-dialog',
    template: `<div style="background-color: #62b262;
    color: white;
    padding-left: 30px;">
	<h3 mat-dialog-title style="color: white;">Mensaje</h3>

	</div>
	<div class="p-30">
    <p mat-dialog-content>Proceso realizado correctamente</p>
    <div mat-dialog-actions>
        <button mat-button mat-dialog-close (click)="close()" class="border-none fw-semibold ps-30 pe-30 pt-12 pb-12 cursor-pointer">Cerrar</button>
    </div>
	</div>
	`,
})
export class ModalCorrecto {

    constructor(
        public dialogRef: MatDialogRef<ModalCorrecto>
    ) {}

    close(){
        this.dialogRef.close(true);
    }

}


@Component({
    selector: 'modal-error',
    template: `<div style="background-color: #b85252;
    color: white;
    padding-left: 30px;">
	<h3 mat-dialog-title style="color: white;">Mensaje</h3>

	</div>
	<div class="p-30">
    <p mat-dialog-content>Problema al realizar el proceso</p>
    <div mat-dialog-actions>
        <button mat-button mat-dialog-close (click)="close()" class="border-none fw-semibold ps-30 pe-30 pt-12 pb-12 cursor-pointer">Cerrar</button>
    </div>
	</div>
	`,
})
export class ModalError {

    constructor(
        public dialogRef: MatDialogRef<ModalError>
    ) {}

    close(){
        this.dialogRef.close(true);
    }

}