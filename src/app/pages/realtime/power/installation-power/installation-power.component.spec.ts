import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallationPowerComponent } from './installation-power.component';

describe('InstallationPowerComponent', () => {
  let component: InstallationPowerComponent;
  let fixture: ComponentFixture<InstallationPowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstallationPowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallationPowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
