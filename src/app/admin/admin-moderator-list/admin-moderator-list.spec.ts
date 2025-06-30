import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminModeratorList } from './admin-moderator-list';

describe('AdminModeratorList', () => {
  let component: AdminModeratorList;
  let fixture: ComponentFixture<AdminModeratorList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminModeratorList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminModeratorList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
