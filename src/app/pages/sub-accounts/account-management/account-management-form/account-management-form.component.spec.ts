import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountManagementFormComponent } from './account-management-form.component';

describe('AccountManagementFormComponent', () => {
  let component: AccountManagementFormComponent;
  let fixture: ComponentFixture<AccountManagementFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountManagementFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountManagementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
