import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddVoterEmails } from './add-voter-emails';
import { ModeratorService } from '../moderator.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('AddVoterEmails', () => {
  let component: AddVoterEmails;
  let fixture: ComponentFixture<AddVoterEmails>;
  let moderatorServiceSpy: jasmine.SpyObj<ModeratorService>;

  beforeEach(async () => {
    moderatorServiceSpy = jasmine.createSpyObj('ModeratorService', ['addToWhitelist']);

    await TestBed.configureTestingModule({
      imports: [AddVoterEmails, ReactiveFormsModule],
      providers: [{ provide: ModeratorService, useValue: moderatorServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AddVoterEmails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a valid single email', () => {
    component.emailForm.setValue({ email: 'test@example.com' });
    moderatorServiceSpy.addToWhitelist.and.returnValue(of({}));

    component.addSingleEmail();

    expect(moderatorServiceSpy.addToWhitelist).toHaveBeenCalledWith(['test@example.com']);
    expect(component.message).toContain('added successfully');
  });

  it('should not add email if form is invalid', () => {
    component.emailForm.setValue({ email: '' });

    component.addSingleEmail();

    expect(moderatorServiceSpy.addToWhitelist).not.toHaveBeenCalled();
  });

  it('should parse uploaded file and populate uploadedEmails list', () => {
    const file = new File(['a@example.com\nb@example.com'], 'emails.txt', { type: 'text/plain' });
    const event = { target: { files: [file] } } as unknown as Event;

    component.handleFileInput(event);

    setTimeout(() => {
      expect(component.uploadedEmails.length).toBe(2);
    }, 100); 
  });

  it('should call service to add bulk emails', () => {
    component.uploadedEmails = ['one@example.com', 'two@example.com'];
    moderatorServiceSpy.addToWhitelist.and.returnValue(of({}));

    component.addBulkEmails();

    expect(moderatorServiceSpy.addToWhitelist).toHaveBeenCalledWith(['one@example.com', 'two@example.com']);
    expect(component.message).toContain('2 emails added');
  });

  it('should remove an email from uploadedEmails list', () => {
    component.uploadedEmails = ['one@example.com', 'two@example.com'];

    component.removeEmail(0);

    expect(component.uploadedEmails).toEqual(['two@example.com']);
  });
});
