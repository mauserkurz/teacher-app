// angular
import { Injectable } from '@angular/core';
// vendor
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import { Store } from "@ngrx/store";
// state
import { AppState } from "../../store/state/app.state";
// selector
import { getUser } from "../../store/reducers/user.reducer";

@Injectable ()
export class LoggingGuardService {

  constructor (
    private store: Store<AppState>
  ) {}

  canActivate (): Observable<boolean> {
    return this.store.select(getUser).map(value => !!value);
  }

}
