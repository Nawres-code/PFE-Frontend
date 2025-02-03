import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdcDashComponent } from './cdc-dash.component';

describe('CdcDashComponent', () => {
  let component: CdcDashComponent;
  let fixture: ComponentFixture<CdcDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CdcDashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CdcDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
