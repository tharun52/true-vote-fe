import { Component } from '@angular/core';
import { MessageModel } from '../../models/MessageModel';
import { UserService } from '../../shared/UserService';
import { MessageService } from '../message.service';
import { DatePipe } from '@angular/common';
import { ToastService } from '../../shared/ToastService';
import { PollModel } from '../../models/PollModels';
import { PollCard } from "../../polls/poll-card/poll-card";
import { PollService } from '../../polls/poll.service';

@Component({
  selector: 'app-message-created',
  imports: [DatePipe, PollCard],
  templateUrl: './message-created.html',
  styleUrl: './message-created.css'
})
export class MessageCreated {
  messages: MessageModel[] = [];
  emailCache: { [key: string]: string } = {};
  loading: boolean = false;
  pollMap: { [pollId: string]: PollModel } = {};
  selectedPoll: PollModel | null = null;

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private toastService: ToastService,
    private pollService:PollService
  ) {}

  ngOnInit(): void {
    this.loadCreatedMessages();
  }

   loadCreatedMessages() {
    this.loading = true;
    this.messageService.getCreatedMessages().subscribe({
      next: (msgs) => {
        this.messages = msgs;
        msgs.forEach(msg => {
          if (msg.pollId && !this.pollMap[msg.pollId]) {
            this.pollService.getPollById(msg.pollId).subscribe({
              next: (poll) => this.pollMap[msg.pollId!] = poll,
              error: (err) => console.error('Poll fetch failed:', err)
            });
          }
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load created messages', err);
        this.loading = false;
      }
    });
  }

  deleteMessage(id: string) {
    const confirmed = window.confirm('Are you sure you want to delete this message?');
    if (confirmed) {
      this.messageService.deleteCreatedMessage(id).subscribe(() => {
        this.loadCreatedMessages();
        this.toastService.show("Message Deleted", "This message has been deleted successfully and it is no longer visible to voters", true);
      });
    }
  }


  getEmail(userId: string): string {
    if (!userId) return '';

    if (!this.emailCache[userId]) {
      this.userService.getUserById(userId).subscribe({
        next: (res) => this.emailCache[userId] = res.email,
        error: (err) => {
          console.error(`Failed to fetch email for userId: ${userId}`, err);
          this.emailCache[userId] = 'Unknown';
        }
      });
      return 'Loading...';
    }

    return this.emailCache[userId];
  }

    openPollModal(pollId: string) {
    this.selectedPoll = this.pollMap[pollId];
  }

  closePollModal() {
    this.selectedPoll = null;
  }
}