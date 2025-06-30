import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModerator } from './add-moderator';

describe('AddModerator', () => {
  let component: AddModerator;
  let fixture: ComponentFixture<AddModerator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddModerator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddModerator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
