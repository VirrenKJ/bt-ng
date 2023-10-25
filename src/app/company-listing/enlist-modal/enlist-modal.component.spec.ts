import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnlistModalComponent } from './enlist-modal.component';

describe('EnlistModalComponent', () => {
  let component: EnlistModalComponent;
  let fixture: ComponentFixture<EnlistModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnlistModalComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnlistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
