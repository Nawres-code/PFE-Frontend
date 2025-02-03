import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StackedBarEnergyComponent } from './stacked-bar-energy.component';


describe('StackedBarComponent', () => {
  let component: StackedBarEnergyComponent;
  let fixture: ComponentFixture<StackedBarEnergyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackedBarEnergyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedBarEnergyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
