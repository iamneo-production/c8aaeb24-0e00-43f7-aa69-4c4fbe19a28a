import { TestBed } from '@angular/core/testing';

import { FormValidatorsService } from './formvalidators.service';

describe('ValidatorsService', () => {
	let service: FormValidatorsService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(FormValidatorsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
