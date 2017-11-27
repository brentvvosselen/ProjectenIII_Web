import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostsPayComponent } from './costs-pay.component';

describe('CostsPayComponent', () => {
  let component: CostsPayComponent;
  let fixture: ComponentFixture<CostsPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostsPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostsPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
