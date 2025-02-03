import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAccountManagementComponent } from './sub-account-management.component';

describe('SubAccountManagementComponent', () => {
  let component: SubAccountManagementComponent;
  let fixture: ComponentFixture<SubAccountManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubAccountManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubAccountManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
