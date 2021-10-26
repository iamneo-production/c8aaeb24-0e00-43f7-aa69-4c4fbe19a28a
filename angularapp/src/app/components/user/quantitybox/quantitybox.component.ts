import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-quantitybox',
	templateUrl: './quantitybox.component.html',
	styleUrls: ['./quantitybox.component.css'],
})
export class QuantityboxComponent implements OnInit {
	constructor(
		public dialogRef: MatDialogRef<QuantityboxComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {}

	ngOnInit(): void {}

	onNoClick() {
		this.dialogRef.close();
	}
}
