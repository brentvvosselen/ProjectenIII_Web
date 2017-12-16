import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSetupPopupComponent } from './home-setup-popup.component';

describe('HomeSetupPopupComponent', () => {
  let component: HomeSetupPopupComponent;
  let fixture: ComponentFixture<HomeSetupPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeSetupPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSetupPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
