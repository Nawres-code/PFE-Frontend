import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallationDataComponent } from './installation-data.component';

describe('InstallationDataComponent', () => {
  let component: InstallationDataComponent;
  let fixture: ComponentFixture<InstallationDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstallationDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallationDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
