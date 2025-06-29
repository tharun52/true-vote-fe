import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorEditForm } from './moderator-edit-form';

describe('ModeratorEditForm', () => {
  let component: ModeratorEditForm;
  let fixture: ComponentFixture<ModeratorEditForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeratorEditForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeratorEditForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
