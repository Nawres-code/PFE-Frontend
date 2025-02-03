import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputsBarComponent } from './inputs-bar.component';

describe('InputsBarComponent', () => {
  let component: InputsBarComponent;
  let fixture: ComponentFixture<InputsBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputsBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
