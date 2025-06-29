import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorDetail } from './moderator-detail';

describe('ModeratorDetail', () => {
  let component: ModeratorDetail;
  let fixture: ComponentFixture<ModeratorDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeratorDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeratorDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
