import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection  } from 'angularfire2/firestore';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, throttleTime } from 'rxjs/operators';

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
  lastLinks$: Observable<string[]>;
  lastImages$: Observable<string[]>;
  deletedSubject = new Subject();
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
      })
    );
    this.lastLinks$ = this.items
      .pipe(
        map(messages =>{
          var filtered = messages.filter(message => message.link != null); 
          return filtered.slice(Math.max(filtered.length - 5, 1))
        }),
        map(messages => messages.map(message => message.link))
      );
      this.lastImages$ = this.items
      .pipe(
        map(messages =>{
          var filtered = messages.filter(message => message.image != null); 
          return filtered.slice(Math.max(filtered.length - 5, 1))
        }),
        map(messages => messages.map(message => message.image))
      );
    // this.lastLinks$ = this.itemsCollection.stateChanges(["added", "removed"])
    //   .pipe(
    //     scan(change => change.)
    //     map(changes => changes.map(change => change.payload.doc.data() as IMessage)),
    //     filter(message => message.image)
    //     map(messages => messages.slice(Math.max(messages.length - 5, 1)))
    //   );

    this.deletedSubject
      .pipe(
        throttleTime(100)
      )
      .subscribe((deletedItem: IMessageId) => this
          .remove(deletedItem));
  }

  remove(message: IMessageId) {
    this.itemsCollection.doc(message.id).delete();
  }

  addMessage(message: IMessage): void {
    this.itemsCollection
      .add({ 
        sender: message.sender, 
        body: message.body, 
        timestamp: new Date().toString(), 
        image: message.image, 
        link: message.link 
      });
  }
}