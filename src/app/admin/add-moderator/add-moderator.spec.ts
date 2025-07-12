import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddModerator } from './add-moderator';
import { ReactiveFormsModule } from '@angular/forms';
import { ModeratorService } from '../../moderator/moderator.service';
import { ToastService } from '../../shared/ToastService';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('AddModerator', () => {
  let component: AddModerator;
  let fixture: ComponentFixture<AddModerator>;
  let moderatorServiceSpy: jasmine.SpyObj<ModeratorService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    moderatorServiceSpy = jasmine.createSpyObj('ModeratorService', ['addModerator']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AddModerator, ReactiveFormsModule],
      providers: [
        { provide: ModeratorService, useValue: moderatorServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddModerator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show validation error when form is invalid', () => {
    component.submit();
    expect(component.responseMessage).toBe('Please fill all required fields properly.');
  });

  it('should submit form and navigate on success', () => {
    const formValue = {
      name: 'Moderator One',
      email: 'mod@example.com',
      password: 'Password123',
      confirmPassword: 'Password123'
    };

    component.moderatorForm.setValue(formValue);
    moderatorServiceSpy.addModerator.and.returnValue(of({}));

    component.submit();

    expect(moderatorServiceSpy.addModerator).toHaveBeenCalledWith(formValue);
    expect(toastServiceSpy.show).toHaveBeenCalledWith('Success', '✅ Moderator added successfully!', false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('should show error toast on failure', () => {
    const formValue = {
      name: 'Moderator One',
      email: 'mod@example.com',
      password: 'Password123',
      confirmPassword: 'Password123'
    };

    component.moderatorForm.setValue(formValue);
    moderatorServiceSpy.addModerator.and.returnValue(throwError(() => 'Add failed'));

    component.submit();

    expect(toastServiceSpy.show).toHaveBeenCalledWith('Error', '❌ Failed to add moderator.', true);
  });
});
