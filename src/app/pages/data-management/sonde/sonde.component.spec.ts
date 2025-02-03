import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SondeComponent } from './sonde.component';

describe('SondeComponent', () => {
  let component: SondeComponent;
  let fixture: ComponentFixture<SondeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SondeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SondeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
