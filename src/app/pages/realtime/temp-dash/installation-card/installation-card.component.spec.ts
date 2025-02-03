import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallationCardComponent } from './installation-card.component';

describe('InstallationCardComponent', () => {
  let component: InstallationCardComponent;
  let fixture: ComponentFixture<InstallationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstallationCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstallationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
