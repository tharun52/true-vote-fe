import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollsList } from './polls-list';

describe('PollsList', () => {
  let component: PollsList;
  let fixture: ComponentFixture<PollsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
