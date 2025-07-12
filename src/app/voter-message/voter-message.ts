import { Component } from '@angular/core';
import { MessageInbox } from "../message/message-inbox/message-inbox";
import { AddMessage } from "../message/add-message/add-message";
import { MessageCreated } from "../message/message-created/message-created";

@Component({
  selector: 'app-voter-message',
  imports: [MessageInbox, AddMessage, MessageCreated],
  templateUrl: './voter-message.html',
  styleUrl: './voter-message.css'
})
export class VoterMessage {

}
