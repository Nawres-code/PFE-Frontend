import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputsManagementComponent } from './inputs-management.component';

describe('InputsManagementComponent', () => {
  let component: InputsManagementComponent;
  let fixture: ComponentFixture<InputsManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputsManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
