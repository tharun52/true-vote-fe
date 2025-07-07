import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorMessage } from './moderator-message';

describe('ModeratorMessage', () => {
  let component: ModeratorMessage;
  let fixture: ComponentFixture<ModeratorMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeratorMessage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeratorMessage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
