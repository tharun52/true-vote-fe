import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorPolls } from './moderator-polls';

describe('ModeratorPolls', () => {
  let component: ModeratorPolls;
  let fixture: ComponentFixture<ModeratorPolls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeratorPolls]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeratorPolls);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
