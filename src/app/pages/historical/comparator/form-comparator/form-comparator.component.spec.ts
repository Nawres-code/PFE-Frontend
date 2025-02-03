import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormComparatorComponent } from './form-comparator.component';

describe('FormComparatorComponent', () => {
  let component: FormComparatorComponent;
  let fixture: ComponentFixture<FormComparatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormComparatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComparatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
