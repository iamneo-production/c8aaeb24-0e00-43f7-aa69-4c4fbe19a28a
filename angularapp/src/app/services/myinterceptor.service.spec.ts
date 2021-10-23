import { TestBed } from '@angular/core/testing';

import { MyinterceptorService } from './myinterceptor.service';

describe('MyinterceptorService', () => {
  let service: MyinterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyinterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
