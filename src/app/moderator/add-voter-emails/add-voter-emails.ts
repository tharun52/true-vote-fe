import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModeratorService } from '../moderator.service';

@Component({
  selector: 'app-add-voter-emails',
  imports: [ReactiveFormsModule],
  templateUrl: './add-voter-emails.html',
  styleUrl: './add-voter-emails.css'
})
export class AddVoterEmails {
  emailForm: FormGroup;
  uploadedEmails: string[] = [];
  message = '';

  constructor(private moderatorService: ModeratorService) {
    this.emailForm = new FormGroup({
      email: new FormControl('', Validators.email)
    })
  }

  public get email() { return this.emailForm.get('email'); }

  addSingleEmail() {
    const email = this.emailForm.value.email;
    if (!email) return;

    this.moderatorService.addToWhitelist([email]).subscribe({
      next: () => {
        this.message = `✅ ${email} added successfully.`;
        this.emailForm.reset();
      },
      error: (err) => {
        const apiMessage = err?.error?.message || `❌ Failed to add ${email}.`;
        this.message = `❌ ${apiMessage}`;
      }
    });
  }


  handleFileInput(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      this.uploadedEmails = content
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(line)); // basic email filter
    };
    reader.readAsText(file);
  }

  addBulkEmails() {
    if (this.uploadedEmails.length === 0) return;

    this.moderatorService.addToWhitelist(this.uploadedEmails).subscribe({
      next: () => {
        this.message = `✅ ${this.uploadedEmails.length} emails added successfully.`;
      },
      error: (err) => {
        const apiMessage = err?.error?.message || '❌ Failed to add emails.';
        this.message = `❌ ${apiMessage}`;
      }
    });
  }
  removeEmail(index: number) {
    this.uploadedEmails.splice(index, 1);
  }
}
