import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorsList } from './moderators-list';

describe('ModeratorsList', () => {
  let component: ModeratorsList;
  let fixture: ComponentFixture<ModeratorsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeratorsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeratorsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
