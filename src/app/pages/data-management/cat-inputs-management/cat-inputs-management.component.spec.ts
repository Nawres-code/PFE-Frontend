import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatInputsManagementComponent } from './cat-inputs-management.component';

describe('InputsManagementComponent', () => {
  let component: CatInputsManagementComponent;
  let fixture: ComponentFixture<CatInputsManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatInputsManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatInputsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
