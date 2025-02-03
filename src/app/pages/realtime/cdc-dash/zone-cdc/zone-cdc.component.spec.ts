import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneCdcComponent } from './zone-cdc.component';

describe('ZoneCdcComponent', () => {
  let component: ZoneCdcComponent;
  let fixture: ComponentFixture<ZoneCdcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneCdcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoneCdcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
