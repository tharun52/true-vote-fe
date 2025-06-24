import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVoterEmails } from './add-voter-emails';

describe('AddVoterEmails', () => {
  let component: AddVoterEmails;
  let fixture: ComponentFixture<AddVoterEmails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVoterEmails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVoterEmails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
