import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection  } from 'angularfire2/firestore';
import { IMessage } from '../models/imessage';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.css']
})
export class NewMessageComponent implements OnInit {
  body: string;
  messagesCollection: AngularFirestoreCollection<IMessage>;
  constructor(private db: AngularFirestore) {
    this.messagesCollection = db.collection<IMessage>('messages');
  }

  ngOnInit() {
  }

  addMessage(body: string, sender: string): void {
    this.messagesCollection.add({ sender: sender, body: body, timestamp: new Date().toString() });
  }
}
