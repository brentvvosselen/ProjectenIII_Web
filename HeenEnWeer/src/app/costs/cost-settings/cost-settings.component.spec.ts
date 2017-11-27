import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostSettingsComponent } from './cost-settings.component';

describe('CostSettingsComponent', () => {
  let component: CostSettingsComponent;
  let fixture: ComponentFixture<CostSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
