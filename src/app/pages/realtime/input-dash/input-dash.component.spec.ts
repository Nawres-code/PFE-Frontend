import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDashComponent } from './input-dash.component';

describe('InputDashComponent', () => {
  let component: InputDashComponent;
  let fixture: ComponentFixture<InputDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputDashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
