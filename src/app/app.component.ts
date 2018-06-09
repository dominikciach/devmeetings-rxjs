import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection  } from 'angularfire2/firestore';
import { Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { IMessage } from './models/imessage';

export interface IMessageId extends IMessage {
  id: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private itemsCollection: AngularFirestoreCollection<IMessage>;
  title = 'My First Angular App!';
  items: Observable<IMessageId[]>;
  order: Subject<string> = new Subject<string>();
  constructor(private db: AngularFirestore) {
    this.itemsCollection = db.collection<IMessage>('messages', ref => ref.orderBy('timestamp', "asc"));
    this.items = this.itemsCollection.snapshotChanges(['added', 'removed'])
    .pipe(
      map(document => {
        return document.map(a => {
          const rawData = a.payload.doc.data() as IMessage;
          const id = a.payload.doc.id;
          return { id, ...rawData };
        })
      }));

    // this.items = 
    //   this.order.pipe(
    //     switchMap(ord => {
    //       return db.collection<IMessage>('messages', 
    //       ref => ref.orderBy('timestamp', "asc"))
    //       .valueChanges();
    //     })
    //   );
    // this.order.next("asc");

    // this.items = this.itemsCollection
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

  remove(message: IMessageId) {
    this.itemsCollection.doc(message.id).delete();
  }
}