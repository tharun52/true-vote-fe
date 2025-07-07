import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageCreated } from './message-created';

describe('MessageCreated', () => {
  let component: MessageCreated;
  let fixture: ComponentFixture<MessageCreated>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageCreated]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageCreated);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
