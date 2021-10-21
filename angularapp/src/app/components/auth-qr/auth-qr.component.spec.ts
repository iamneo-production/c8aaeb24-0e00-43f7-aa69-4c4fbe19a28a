import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthQrComponent } from './auth-qr.component';

describe('AuthQrComponent', () => {
  let component: AuthQrComponent;
  let fixture: ComponentFixture<AuthQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthQrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
