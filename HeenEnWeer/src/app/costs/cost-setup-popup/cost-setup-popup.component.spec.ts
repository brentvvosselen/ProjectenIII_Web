import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostSetupPopupComponent } from './cost-setup-popup.component';

describe('CostSetupPopupComponent', () => {
  let component: CostSetupPopupComponent;
  let fixture: ComponentFixture<CostSetupPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostSetupPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostSetupPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
