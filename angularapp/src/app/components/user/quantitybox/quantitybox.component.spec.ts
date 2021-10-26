import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityboxComponent } from './quantitybox.component';

describe('QuantityboxComponent', () => {
  let component: QuantityboxComponent;
  let fixture: ComponentFixture<QuantityboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuantityboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantityboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
