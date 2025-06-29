import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModeratorModel } from '../../models/ModeratorModel';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../shared/ToastService';
import { AuthService } from '../../auth/auth.service';
import { passwordValidator } from '../../auth/validators/password-validator';
import { passwordMatchValidator } from '../../auth/validators/password-match.validator';

@Component({
  selector: 'app-moderator-edit-form',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './moderator-edit-form.html',
  styleUrl: './moderator-edit-form.css'
})
export class ModeratorEditForm {
  @Input() moderator!: ModeratorModel;
  @Input() isModerator: boolean = false;
  @Input() isAdmin: boolean = false;

  @Output() update = new EventEmitter<any>();
  @Output() updateWithPassword = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  changePasswordMode = false;

  constructor(private toastService:ToastService, private authService:AuthService)
  {}
  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(this.moderator.name, Validators.required),
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
    this.toastService.show('Moderator Update', 'Moderator details have been updated successfully!', false);
  }

  onUpdateWithPassword(): void {
    if (this.form.invalid) return;

    const { name, age, newPassword } = this.form.value;
    this.updateWithPassword.emit({ name, age, newPassword });
    this.toastService.show('Password Change', 'Password has been changed successfully!', false);  
  }

  get name() { return this.form.get('name'); }
  get age() { return this.form.get('age'); }
  get newPassword() { return this.form.get('newPassword'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }
}
