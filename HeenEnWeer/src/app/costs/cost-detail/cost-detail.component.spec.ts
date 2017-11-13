import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostDetailComponent } from './cost-detail.component';

describe('CostDetailComponent', () => {
  let component: CostDetailComponent;
  let fixture: ComponentFixture<CostDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
