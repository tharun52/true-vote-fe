import { Component } from '@angular/core';
import { MessageService } from '../message.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PollResponseItemModel, PollQueryDto } from '../../models/PollModels';
import { PollService } from '../../polls/poll.service';
import { PollCard } from "../../polls/poll-card/poll-card";
import { VoterService } from '../../voter/voter.service';
import { VoterModel } from '../../models/VoterModel';

@Component({
  selector: 'app-add-message',
  imports: [FormsModule, ReactiveFormsModule, PollCard],
  templateUrl: './add-message.html',
  styleUrl: './add-message.css'
})
export class AddMessage {
  messageForm: FormGroup;
  loading = false;
  success = false;
  error: string | null = null;

  selectedPoll: PollResponseItemModel | null = null;
  polls: PollResponseItemModel[] = [];
  searchTerm = '';
  currentPage = 1;
  totalPages = 1;
  showPollModal = false;

  voters: VoterModel[] = [];
  selectedVoter: VoterModel | null = null; // ✅ single voter
  showVoterModal = false;

  constructor(
    private messageService: MessageService,
    private pollService: PollService,
    private voterService: VoterService
  ) {
    this.messageForm = new FormGroup({
      msg: new FormControl('', Validators.required),
      pollId: new FormControl(''),
      to: new FormControl('')
    });

    this.loadPolls(); 
  }

  get msg() {
    return this.messageForm.get('msg');
  }

  get pollId() {
    return this.messageForm.get('pollId');
  }

  loadPolls() {
    const query: PollQueryDto = {
      searchTerm: this.searchTerm,
      page: this.currentPage,
      ForVoting : false,
      pageSize: 6
    };

    this.pollService.getPolls(query).subscribe((res) => {
      this.polls = res.data;
      this.totalPages = res.pagination.totalPages;
    });
  }

  selectPoll(poll: PollResponseItemModel) {
    this.selectedPoll = poll;
    this.messageForm.patchValue({ pollId: poll.poll.id });
     this.closePollModal(); 
  }

  sendMessage() {
    if (this.messageForm.invalid) {
      this.messageForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.success = false;
    this.error = null;

    const formValue = this.messageForm.value;
    const payload: any = {
      msg: formValue.msg
    };

    if (this.selectedPoll?.poll?.id) {
      payload.pollId = this.selectedPoll.poll.id;
    }

    if (this.selectedVoter) {
      payload.to = this.selectedVoter.id; // ✅ single voter
    }

    console.log('Sending:', payload);

    this.messageService.addMessage(payload).subscribe({
      next: () => {
        this.success = true;
        this.messageForm.reset();
        this.selectedPoll = null;
        this.selectedVoter = null;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to send message';
        console.error(err);
        this.loading = false;
      }
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPolls();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPolls();
    }
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.currentPage = 1;
    this.loadPolls();
  }
  openPollModal() {
    this.showPollModal = true;
  }

  closePollModal() {
    this.showPollModal = false;
  }

  toggleVoterSelection(voter: VoterModel) {
    this.selectedVoter = voter;
    this.messageForm.patchValue({
      to: voter.id
    });
    this.closeVoterModal(); // ✅ close modal immediately
  }
  isVoterSelected(voter: VoterModel): boolean {
    return this.selectedVoter?.id === voter.id;
  }

  closeVoterModal() {
    this.showVoterModal = false;
  }

  openVoterModal() {
    this.showVoterModal = true;
    this.voterService.getAllVoters().subscribe(voters => {
      this.voters = voters;
    });
  }
}
