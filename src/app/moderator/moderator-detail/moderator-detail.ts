import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModeratorModel } from '../../models/ModeratorModel';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModeratorService } from '../moderator.service';
import { AuthService } from '../../auth/auth.service';
import { passwordValidator } from '../../auth/validators/password-validator';
import { passwordMatchValidator } from '../../auth/validators/password-match.validator';
import { NgClass } from '@angular/common';
import { PollsList } from '../../polls/polls-list/polls-list';
import { ModeratorEditForm } from '../moderator-edit-form/moderator-edit-form';

@Component({
  selector: 'app-moderator-detail',
  standalone: true,
  imports: [NgClass, FormsModule, ReactiveFormsModule, PollsList, ModeratorEditForm],
  templateUrl: './moderator-detail.html',
  styleUrls: ['./moderator-detail.css'] 
})
export class ModeratorDetail {
  @Input() email!: string;
  @Input() isAdmin: boolean = false;
  @Output() close = new EventEmitter<void>();

  moderator: ModeratorModel | null = null;
  isModerator = false;
  editMode = false;
  ceratedPollsMode = false;
  changePasswordMode = false;

  editForm!: FormGroup;

  moderatorId: string = '';

  loading = true;

  constructor(
    private moderatorService: ModeratorService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const role = this.authService.getCurrentUser()?.role;
    this.isAdmin = role === 'Admin';
    this.isModerator = role === 'Moderator'; 

    if (this.email) {
      this.fetchModerator();
    }
  }

  fetchModerator(): void {
    this.loading = true;

    this.moderatorService.getModeratorByEmail(this.email).subscribe({
      next: (data) => {
        this.moderator = data;
        this.initForm(data);
        this.moderatorId = data.id;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching moderator:', err);
        this.loading = false;
      }
    });
  }

  public get name() { return this.editForm.get('name'); }
  public get prevPassword() { return this.editForm.get('prevPassword'); }
  public get newPassword() { return this.editForm.get('newPassword'); }
  public get confirmPassword() { return this.editForm.get('confirmPassword'); }


  initForm(data: ModeratorModel): void {
    this.editForm = new FormGroup({
      name: new FormControl(data.name, Validators.required),
      prevPassword: new FormControl(Validators.required),
      newPassword: new FormControl('', passwordValidator),
      confirmPassword: new FormControl('')
    }, passwordMatchValidator);
  }

  toggleChangePassword(): void {
    this.changePasswordMode = !this.changePasswordMode;
    if (!this.changePasswordMode) {
      this.editForm.patchValue({
        prevPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }

  submitEdit(data: any): void {
    if (!this.moderator) return;

    if (this.isModerator) {
      data.isDeleted = false;
      this.moderatorService.updateAsAdmin(this.moderator.id, data).subscribe(() => this.refreshData());
    } else if (this.isModerator) {
      data.isDeleted = this.moderator.isDeleted;
      this.moderatorService.updateAsModerator(data).subscribe(() => this.refreshData());
    }
  }

  submitEditWithPassword(data: any): void {
    if (!this.moderator) return;

    data.isDeleted = this.moderator.isDeleted;
    this.moderatorService.updateAsModerator(data).subscribe(() => this.refreshData());
  }


  refreshData(): void {
    this.editMode = false;
    this.changePasswordMode = false;
    if (this.email) {
      this.moderatorService.getModeratorByEmail(this.email).subscribe(data => {
        this.moderator = data;
        this.initForm(data);
      });
    }
  }

  closePopup(): void {
    this.close.emit();
  }

  
  deleteAccount(): void {
    if (!this.moderator) return;

    const confirmDelete = confirm("Are you sure you want to delete this moderator?");
    if (!confirmDelete) return;
    this.moderatorService.deleteModerator(this.moderator.id).subscribe({
      next: () => {
        alert('Moderator account deleted successfully.');
        this.refreshData();
      },
      error: (err) => {
        console.error('Delete failed', err);
        alert('Failed to delete moderator account.');
      }
    });
  }

  reAddModerator(): void {
    if (!this.moderator) return;

    const updatedData = {
      name: this.moderator.name,
      email: this.moderator.email,
      isDeleted: false
    };

    this.moderatorService.updateAsAdmin(this.moderator.id, updatedData).subscribe({
      next: () => {
        alert('Moderator re-added successfully.');
        this.refreshData();
      },
      error: (err) => {
        console.error('Failed to re-add moderator', err);
        alert('Failed to re-add moderator.');
      }
    });
  }
}