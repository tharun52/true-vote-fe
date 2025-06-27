import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VoterModel } from '../../models/VoterModel';
import { VoterService } from '../voter.service';
import { AuthService } from '../../auth/auth.service';
import { NgClass } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../auth/validators/password-match.validator';
import { passwordValidator } from '../../auth/validators/password-validator';
import { VoterEditForm } from "../voter-edit-form/voter-edit-form";

@Component({
  selector: 'app-voter-detail',
  imports: [NgClass, FormsModule, ReactiveFormsModule, VoterEditForm],
  templateUrl: './voter-detail.html',
  styleUrl: './voter-detail.css',
  standalone: true
})
export class VoterDetail {
  @Input() email!: string;
  @Input() isModerator: boolean = false;
  @Output() close = new EventEmitter<void>();

  voter: VoterModel | null = null;
  isVoter = false;
  editMode = false;
  changePasswordMode = false;

  editForm!: FormGroup;

  constructor(
    private voterService: VoterService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const role = this.authService.getCurrentUser()?.role;
    this.isVoter = role === 'Voter';

    if (this.email) {
      this.voterService.getVoterByEmail(this.email).subscribe(data => {
        this.voter = data;
        this.initForm(data);
      });
    }
  }


  public get name() { return this.editForm.get('name'); }
  public get age() { return this.editForm.get('age'); }
  public get prevPassword() { return this.editForm.get('prevPassword'); }
  public get newPassword() { return this.editForm.get('newPassword'); }
  public get confirmPassword() { return this.editForm.get('confirmPassword'); }


  initForm(data: VoterModel): void {
    this.editForm = new FormGroup({
      name: new FormControl(data.name, Validators.required),
      age: new FormControl(data.age, [Validators.required, Validators.min(18)]),
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
    if (!this.voter) return;

    if (this.isModerator) {
      data.isDeleted = false;
      this.voterService.updateAsAdmin(this.voter.id, data).subscribe(() => this.refreshData());
    } else if (this.isVoter) {
      data.isDeleted = this.voter.isDeleted;
      this.voterService.updateAsVoter(data).subscribe(() => this.refreshData());
    }
  }

  submitEditWithPassword(data: any): void {
    if (!this.voter) return;

    data.isDeleted = this.voter.isDeleted;
    this.voterService.updateAsVoter(data).subscribe(() => this.refreshData());
  }


  refreshData(): void {
    this.editMode = false;
    this.changePasswordMode = false;
    if (this.email) {
      this.voterService.getVoterByEmail(this.email).subscribe(data => {
        this.voter = data;
        this.initForm(data);
      });
    }
  }

  closePopup(): void {
    this.close.emit();
  }

  deleteAccount(): void {
    if (!this.voter) return;

    const confirmDelete = confirm("Are you sure you want to delete this voter?");
    if (!confirmDelete) return;

    this.voterService.deleteVoter(this.voter.id).subscribe({
      next: () => {
        alert('Voter account deleted successfully.');
        // this.closePopup();
        this.refreshData();
      },
      error: (err) => {
        console.error('Delete failed', err);
        alert('Failed to delete voter account.');
      }
    });
  }

  reAddVoter(): void {
    if (!this.voter) return;

    const updatedData = {
      name: this.voter.name,
      age: this.voter.age,
      email: this.voter.email,
      isDeleted: false
    };

    this.voterService.updateAsAdmin(this.voter.id, updatedData).subscribe({
      next: () => {
        alert('Voter re-added successfully.');
        this.refreshData();
      },
      error: (err) => {
        console.error('Failed to re-add voter', err);
        alert('Failed to re-add voter.');
      }
    });
  }
}