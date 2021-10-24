import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable({
	providedIn: 'root',
})
export class FormValidatorsService {
	constructor() {}

	public loginForm = new FormGroup({
		email: new FormControl('', [
			Validators.required,
			Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
			Validators.email,
		]),
		password: new FormControl('', [
			Validators.required,
			Validators.minLength(4),
			Validators.maxLength(20),
		]),
	});

	checkOutForm = new FormGroup({
		email: new FormControl('', [
			Validators.required,
			Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
			Validators.email,
		]),
		password: new FormControl('', [
			Validators.required,
			Validators.minLength(4),
			Validators.maxLength(20),
		]),
		address: new FormControl('', [
			Validators.required,
			Validators.minLength(10),
		]),
		city: new FormControl('', [Validators.required, Validators.minLength(10)]),
		pincode: new FormControl('', [
			Validators.required,
			Validators.minLength(6),
			Validators.maxLength(6),
		]),
	});
}
