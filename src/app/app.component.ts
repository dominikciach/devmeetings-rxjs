import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface IMessage {
  body: string;
  sender: string;
  timestamp: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My First Angular App!';
  items: Observable<IMessage[]>;
  constructor(db: AngularFirestore) {
    this.items = db.collection<IMessage>('messages', 
      ref => ref.orderBy('timestamp', 'asc'))
      .valueChanges();

    // this.items = db.collection<IMessage>('messages')
    // .valueChanges()
    // .pipe(
    //   map((messages : IMessage[]) => messages
    //     .sort((messageA : IMessage, messageB : IMessage) => {
    //       if (messageA.timestamp === messageB.timestamp) {
    //         return 0;
    //       }
    //       return -1 * (messageA.timestamp < messageB.timestamp ? -1 : 1);
    //     }))
    // );
  }
}