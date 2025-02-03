import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerActionComponent } from './power-action.component';

describe('PowerActionComponent', () => {
  let component: PowerActionComponent;
  let fixture: ComponentFixture<PowerActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowerActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
