import { Component } from '@angular/core';
import { MessageCreated } from "../../message/message-created/message-created";
import { MessageInbox } from "../../message/message-inbox/message-inbox";
import { AddMessage } from "../../message/add-message/add-message";

@Component({
  selector: 'app-moderator-message',
  imports: [MessageCreated, MessageInbox, AddMessage],
  templateUrl: './moderator-message.html',
  styleUrl: './moderator-message.css'
})
export class ModeratorMessage {

}
