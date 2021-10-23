import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartdialogComponent } from './cartdialog.component';

describe('CartdialogComponent', () => {
	let component: CartdialogComponent;
	let fixture: ComponentFixture<CartdialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [CartdialogComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CartdialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
