import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainpanelPowerComponent } from './mainpanel-power.component';

describe('MainpanelPowerComponent', () => {
  let component: MainpanelPowerComponent;
  let fixture: ComponentFixture<MainpanelPowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainpanelPowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainpanelPowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
