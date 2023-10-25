import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProfileModalComponent } from './add-profile-modal.component';

describe('AddProfileModalComponent', () => {
  let component: AddProfileModalComponent;
  let fixture: ComponentFixture<AddProfileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddProfileModalComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
