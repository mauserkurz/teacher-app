// angular
import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
// vendor
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/publishReplay";
import { Store } from "@ngrx/store";
import { Md5 } from "ts-md5/dist/md5";
// model
import { User } from "../models/user";
// service
import { OnlineService } from "../../common/online.service";
// config
import { API_URL } from "../../configuration";
// state
import { AppState } from "../../store/state/app.state";
// actions
import { DeleteUser, SaveUser } from "../../store/actions/user.actions";
import { RemoveAllGroup } from "../../store/actions/group.actions";
import { RemoveAllLesson } from "../../store/actions/lesson.actions";
import { RemoveAllMatter } from "../../store/actions/matter.actions";
import { RemoveAllNote } from "../../store/actions/note.actions";
import { RemoveAllScore } from "../../store/actions/score.actions";
import { RemoveAllStudent } from "../../store/actions/student.actions";
// selector
import { getUser } from "../../store/reducers/user.reducer";

@Injectable()
export class AuthService {
  user$: Store<User> = this._store.select(getUser);
  isLogged$: Observable<boolean> = this.user$.map(user => !!user).publishReplay(1).refCount();

  constructor(
    private _http: Http,
    private _store: Store<AppState>,
    private _online: OnlineService
  ) {}

  login (login: string, password: string): Observable<User> {
    const pathHash: any = Md5.hashStr(password);

    return this._http.get(`${API_URL}/users?login=${login}&pathHash=${pathHash}`)
      .map((res: Response) => {
        if (res.json()[0]) {
          const currentUser: User = new User(res.json()[0]);

          this._store.dispatch(new SaveUser(currentUser));
          window.localStorage.setItem('currentUser', JSON.stringify(res.json()[0]));
          this._online.init();

          return currentUser;
        } else {
          throw new Error('Пользователь не найден.');
        }
      })
      .publishReplay(1)
      .refCount();
  }

  logout (): void {
    window.localStorage.removeItem('currentUser');
    this._store.dispatch(new DeleteUser());
    this._store.dispatch(new RemoveAllGroup());
    this._store.dispatch(new RemoveAllLesson());
    this._store.dispatch(new RemoveAllMatter());
    this._store.dispatch(new RemoveAllNote());
    this._store.dispatch(new RemoveAllScore());
    this._store.dispatch(new RemoveAllStudent());
    this._online.deleteAllDeferredRequest();
  }

  initAuth (): boolean {
    const currentUserData: any = JSON.parse(window.localStorage.getItem('currentUser'));

      if (currentUserData) {
        this._store.dispatch(new SaveUser(new User(currentUserData)));
      }

    return !!currentUserData;
  }
}
