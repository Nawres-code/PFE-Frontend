import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparatorSidepanelComponent } from './comparator-sidepanel.component';

describe('ComparatorSidepanelComponent', () => {
  let component: ComparatorSidepanelComponent;
  let fixture: ComponentFixture<ComparatorSidepanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparatorSidepanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparatorSidepanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
