import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoterEditForm } from './voter-edit-form';

describe('VoterEditForm', () => {
  let component: VoterEditForm;
  let fixture: ComponentFixture<VoterEditForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoterEditForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoterEditForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
