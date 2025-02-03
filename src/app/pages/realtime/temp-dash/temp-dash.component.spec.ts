import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempDashComponent } from './temp-dash.component';

describe('TempDashComponent', () => {
  let component: TempDashComponent;
  let fixture: ComponentFixture<TempDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TempDashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TempDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
