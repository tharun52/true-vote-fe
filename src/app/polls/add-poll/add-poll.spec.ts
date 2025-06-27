import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPoll } from './add-poll';

describe('AddPoll', () => {
  let component: AddPoll;
  let fixture: ComponentFixture<AddPoll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPoll]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPoll);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
