import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VoterModel } from '../../models/VoterModel';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { passwordMatchValidator } from '../../auth/validators/password-match.validator';
import { passwordValidator } from '../../auth/validators/password-validator';
import { ToastService } from '../../shared/ToastService';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-voter-edit-form',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './voter-edit-form.html',
  styleUrl: './voter-edit-form.css',
  standalone: true
})
export class VoterEditForm {
  @Input() voter!: VoterModel;
  @Input() isVoter: boolean = false;
  @Input() isModerator: boolean = false;

  @Output() update = new EventEmitter<any>();
  @Output() updateWithPassword = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  changePasswordMode = false;

  constructor(private toastService:ToastService, private authService:AuthService)
  {}
  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(this.voter.name, Validators.required),
      age: new FormControl(this.voter.age, [Validators.required, Validators.min(18)]),
      newPassword: new FormControl('', passwordValidator),
      confirmPassword: new FormControl('')
    }, passwordMatchValidator);
  }

  toggleChangePassword(): void {
    this.changePasswordMode = !this.changePasswordMode;
    if (!this.changePasswordMode) {
      this.form.patchValue({
        newPassword: '',
        confirmPassword: ''
      });
    }
  }

  onUpdateOnly(): void {
    if (this.name?.invalid || this.age?.invalid) return;

    const { name, age } = this.form.value;
    this.update.emit({ name, age });
    this.toastService.show('Voter Update', 'Voter details have been updated successfully!', false);
  }

  onUpdateWithPassword(): void {
    if (this.form.invalid) return;

    const { name, age, newPassword } = this.form.value;
    this.updateWithPassword.emit({ name, age, newPassword });
    this.toastService.show('Password Change', 'Password has been changed successfully!', false);
    this.authService.logout();
  }

  get name() { return this.form.get('name'); }
  get age() { return this.form.get('age'); }
  get newPassword() { return this.form.get('newPassword'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }
}