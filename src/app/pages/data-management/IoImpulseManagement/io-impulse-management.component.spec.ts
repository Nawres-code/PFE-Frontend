import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IoImpulseManagementComponent } from './io-impulse-management.component';

describe('IoImpulseManagementComponent', () => {
  let component: IoImpulseManagementComponent;
  let fixture: ComponentFixture<IoImpulseManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IoImpulseManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IoImpulseManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
