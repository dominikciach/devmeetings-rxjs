import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.css']
})
export class NewMessageComponent {

  @Input() public submitButtonText = 'Submit';
  public form: FormGroup;

  @Output() formSubmit = new EventEmitter();
  formSubmitSubject = new Subject();

  constructor(private formBuilder: FormBuilder) {
      this.form = formBuilder.group({
          body: ['', Validators.required],
          sender: ['', Validators.required],
          image: [''],
          link: ['']
      });

      this.formSubmitSubject
          .pipe(
              filter(() => this.form.valid),
              map(() => this.form.value)
          )
          .subscribe(this.formSubmit);
  }
}