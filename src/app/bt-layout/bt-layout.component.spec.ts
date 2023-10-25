import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtLayoutComponent } from './bt-layout.component';

describe('BtLayoutComponent', () => {
  let component: BtLayoutComponent;
  let fixture: ComponentFixture<BtLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BtLayoutComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BtLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
