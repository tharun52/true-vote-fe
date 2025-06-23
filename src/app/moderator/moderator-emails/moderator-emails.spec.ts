import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorEmails } from './moderator-emails';

describe('ModeratorEmails', () => {
  let component: ModeratorEmails;
  let fixture: ComponentFixture<ModeratorEmails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeratorEmails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeratorEmails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
