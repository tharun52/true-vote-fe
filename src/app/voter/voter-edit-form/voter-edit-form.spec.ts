import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoterEditForm } from './voter-edit-form';
import { ReactiveFormsModule } from '@angular/forms';
import { VoterModel } from '../../models/VoterModel';
import { ToastService } from '../../shared/ToastService';
import { AuthService } from '../../auth/auth.service';
import { By } from '@angular/platform-browser';

describe('VoterEditForm', () => {
  let component: VoterEditForm;
  let fixture: ComponentFixture<VoterEditForm>;
  let toastSpy: jasmine.SpyObj<ToastService>;

  const mockVoter: VoterModel = {
    id: '1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    age: 25,
    isDeleted: false,
    moderatorId: 'moderatorId'
  };

  beforeEach(async () => {
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['show']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);

    await TestBed.configureTestingModule({
      imports: [VoterEditForm],
      providers: [
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VoterEditForm);
    component = fixture.componentInstance;

    toastSpy = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;

    component.voter = mockVoter;
    component.isVoter = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with voter data', () => {
    expect(component.form.value.name).toBe('Jane Doe');
    expect(component.form.value.age).toBe(25);
  });

  it('should emit update on onUpdateOnly()', () => {
    spyOn(component.update, 'emit');

    component.onUpdateOnly();

    expect(component.update.emit).toHaveBeenCalledWith({
      name: 'Jane Doe',
      age: 25
    });
    expect(toastSpy.show).toHaveBeenCalledWith(
      'Voter Update',
      'Voter details have been updated successfully!',
      false
    );
  });

  it('should clear password fields on cancel password change', () => {
    component.toggleChangePassword();
    component.form.patchValue({
      newPassword: 'something',
      confirmPassword: 'something'
    });

    component.toggleChangePassword();

    expect(component.form.value.newPassword).toBe('');
    expect(component.form.value.confirmPassword).toBe('');
  });
});
