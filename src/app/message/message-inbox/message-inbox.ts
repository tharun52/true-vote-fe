import { Component } from '@angular/core';
import { MessageModel } from '../../models/MessageModel';
import { MessageService } from '../message.service';
import { DatePipe } from '@angular/common';
import { PollModel } from '../../models/PollModels';
import { PollService } from '../../polls/poll.service';
import { PollCard } from "../../polls/poll-card/poll-card";
import { UserService } from '../../shared/UserService';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-message-inbox',
  imports: [DatePipe, PollCard],
  templateUrl: './message-inbox.html',
  styleUrl: './message-inbox.css'
})
export class MessageInbox {
  messages: MessageModel[] = [];
  pollMap: { [pollId: string]: PollModel } = {};
  emailCache: { [key: string]: string } = {};
  loading: boolean = false;
  selectedPoll: PollModel | null = null;

  constructor(private messageService: MessageService,
    private pollService: PollService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadMessages();
    this.messageService.newMessage$.subscribe((msg) => {
      const currentUserId = this.authService.getCurrentUser()?.userId;
      if (!currentUserId) return;
      if (!msg.to || msg.to.includes(currentUserId)) {
        this.messages.unshift(msg);

        if (msg.pollId && !this.pollMap[msg.pollId]) {
          this.pollService.getPollById(msg.pollId).subscribe({
            next: (poll) => this.pollMap[msg.pollId!] = poll,
            error: (err) => console.error("Poll fetch failed:", err)
          });
        }
      }
    });
    this.messageService.messageDeleted$.subscribe((messageId: string) => {
      this.messages = this.messages.filter(m => m.id !== messageId);
    });
  }

  loadMessages() {
    this.loading = true;
    this.messageService.getMessages().subscribe({
      next: (msgs) => {
        this.messages = msgs;
        msgs.forEach(msg => {
          if (msg.pollId && !this.pollMap[msg.pollId]) {
            this.pollService.getPollById(msg.pollId).subscribe({
              next: (poll) => this.pollMap[msg.pollId!] = poll,
              error: (err) => console.error("Poll fetch failed:", err)
            });
          }
        });
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
  deleteMessage(id: string) {
    this.messageService.deleteMessage(id).subscribe(() => {
      this.loadMessages();
    });
  }

  clearAllMessages() {
    this.messageService.clearAll().subscribe(() => {
      this.loadMessages();
    });
  }
  getEmail(userId: string): string {
    if (!userId) return '';

    if (!this.emailCache[userId]) {
      this.userService.getUserById(userId).subscribe({
        next: (res) => {
          this.emailCache[userId] = res.email;
        },
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

