import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class GoogleApiEventService {

  public notifierSubject: Subject<any> = new Subject();
  public notifierSigninStatus: Subject<boolean> = new Subject();

  public notify(something: any) {
      this.notifierSubject.next(something);
  }

  public notifySigninStatus() {
      this.notifierSigninStatus.next(true);
  }
}
