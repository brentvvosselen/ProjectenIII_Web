import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostBillShowComponent } from './cost-bill-show.component';

describe('CostBillShowComponent', () => {
  let component: CostBillShowComponent;
  let fixture: ComponentFixture<CostBillShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostBillShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostBillShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
