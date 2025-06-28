import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPoll } from './edit-poll';

describe('EditPoll', () => {
  let component: EditPoll;
  let fixture: ComponentFixture<EditPoll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPoll]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPoll);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
