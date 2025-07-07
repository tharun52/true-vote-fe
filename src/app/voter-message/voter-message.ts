import { Component } from '@angular/core';
import { MessageInbox } from "../message/message-inbox/message-inbox";

@Component({
  selector: 'app-voter-message',
  imports: [MessageInbox],
  templateUrl: './voter-message.html',
  styleUrl: './voter-message.css'
})
export class VoterMessage {

}
