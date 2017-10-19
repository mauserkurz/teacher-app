// angular
import { Injectable } from "@angular/core";
// vendor
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/publishReplay";
// model
import { User } from "../models/user";
// testing data
import { user } from "../../helpers/data_for_tests";

@Injectable()
export class MockAuthService {
  user$: BehaviorSubject<User> = new BehaviorSubject(null);
  isLogged$: Observable<boolean> = this.user$.map(user => !!user).publishReplay(1).refCount();

  constructor () {}

  login (login: string, password: string): Observable<User> {
    this.user$.next(user);

    return Observable.of(user);
  }

  logout (): void {}

  initAuth (): boolean {
    return true;
  }
}