import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AddModerator } from './add-moderator';
import { ReactiveFormsModule } from '@angular/forms';
import { ModeratorService } from '../../moderator/moderator.service';
import { Router } from '@angular/router';
import { ToastService } from '../../shared/ToastService';
import { of, throwError } from 'rxjs';

describe('AddModerator Component', () => {
  let component: AddModerator;
  let fixture: ComponentFixture<AddModerator>;
  let moderatorServiceSpy: jasmine.SpyObj<ModeratorService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    moderatorServiceSpy = jasmine.createSpyObj('ModeratorService', ['addModerator']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [AddModerator],
      providers: [
        { provide: ModeratorService, useValue: moderatorServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastService, useValue: toastServiceSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddModerator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and initialize form', () => {
    expect(component).toBeTruthy();
    expect(component.moderatorForm).toBeDefined();
  });

  it('should mark form as invalid if required fields are empty', () => {
    component.submit();
    expect(component.responseMessage).toBe('Please fill all required fields properly.');
  });

  it('should call addModerator and navigate on successful submission', fakeAsync(() => {
    component.moderatorForm.setValue({
      name: 'Test Name',
      email: 'test@example.com',
      password: 'Test1234',
      confirmPassword: 'Test1234'
    });

    moderatorServiceSpy.addModerator.and.returnValue(of({ message: 'Success' }));

    component.submit();
    tick();

    expect(moderatorServiceSpy.addModerator).toHaveBeenCalledWith(component.moderatorForm.value);
    expect(toastServiceSpy.show).toHaveBeenCalledWith('Success', '✅ Moderator added successfully!', false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin']);
  }));

  it('should show error toast on failed submission', fakeAsync(() => {
    component.moderatorForm.setValue({
      name: 'Test Name',
      email: 'test@example.com',
      password: 'Test1234',
      confirmPassword: 'Test1234'
    });

    moderatorServiceSpy.addModerator.and.returnValue(throwError(() => new Error('Failed')));

    component.submit();
    tick();

    expect(moderatorServiceSpy.addModerator).toHaveBeenCalled();
    expect(toastServiceSpy.show).toHaveBeenCalledWith('Error', '❌ Failed to add moderator.', true);
  }));
});
