import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AddPoll } from './add-poll';
import { PollService } from '../poll.service';
import { ToastService } from '../../shared/ToastService';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('AddPoll Component', () => {
  let component: AddPoll;
  let fixture: ComponentFixture<AddPoll>;
  let pollServiceSpy: jasmine.SpyObj<PollService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    pollServiceSpy = jasmine.createSpyObj('PollService', ['addPoll']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, AddPoll],
      providers: [
        { provide: PollService, useValue: pollServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    fixture = TestBed.createComponent(AddPoll);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.optionTexts.length).toBe(2);
  });


  it('should show validation error if required fields are missing on submit', () => {
    component.submit();
    expect(component.responseMessage).toContain('Please fill all required fields');
  });

  it('should call pollService.addPoll and navigate on successful form submit', fakeAsync(() => {
    component.pollForm.patchValue({
      title: 'Test Poll',
      startDate: '2025-07-20',
      endDate: '2025-07-25',
      description: 'Test description',
      ForPublishing: true
    });
    component.optionTexts.at(0).setValue('Option A');
    component.optionTexts.at(1).setValue('Option B');

    const mockResponse = { success: true };
    pollServiceSpy.addPoll.and.returnValue(of(mockResponse));

    component.submit();
    tick();

    expect(pollServiceSpy.addPoll).toHaveBeenCalled();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('Poll Created', 'Poll created successfully!', false);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('moderator/polls');
  }));

  it('should handle poll creation failure gracefully', fakeAsync(() => {
    component.pollForm.patchValue({
      title: 'Test Poll',
      startDate: '2025-07-20',
      endDate: '2025-07-25',
      description: 'Test description',
      ForPublishing: false
    });
    component.optionTexts.at(0).setValue('Option 1');
    component.optionTexts.at(1).setValue('Option 2');

    pollServiceSpy.addPoll.and.returnValue(throwError(() => ({
      error: { message: 'Server error' }
    })));

    component.submit();
    tick();

    expect(component.responseMessage).toBe('Error: Server error');
  }));

  it('should attach poll file when selected', () => {
    const file = new File(['test'], 'testfile.txt');
    const mockEvent = {
      target: {
        files: [file]
      }
    };

    component.onFileChange(mockEvent);
    expect(component.pollFile).toBe(file);
  });
});
