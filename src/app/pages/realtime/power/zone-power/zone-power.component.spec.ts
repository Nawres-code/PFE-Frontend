import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonePowerComponent } from './zone-power.component';

describe('ZonePowerComponent', () => {
  let component: ZonePowerComponent;
  let fixture: ComponentFixture<ZonePowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZonePowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonePowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
