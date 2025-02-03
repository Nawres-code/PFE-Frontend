import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StationsManagementComponent } from './stations-management.component';

describe('StationsManagementComponent', () => {
  let component: StationsManagementComponent;
  let fixture: ComponentFixture<StationsManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StationsManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StationsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
