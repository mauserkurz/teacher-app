// angular
import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Response } from "@angular/http";
// vendor
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/observable/merge";
import 'rxjs/add/observable/fromEvent';
import "rxjs/add/operator/toPromise";
import { Store } from "@ngrx/store";
import { AngularIndexedDB } from "angular2-indexeddb";
// models
import { Matter } from "../core/models/matter";
import { Lesson } from "../core/models/lesson";
import { Group } from "../core/models/group";
import { User } from "../auth/models/user";
import { Score } from "../core/models/score";
import { Note } from "../core/models/note";
import { Student } from "../core/models/student";
// state
import { AppState } from "../store/state/app.state";
// actions
import { LoadLesson } from "../store/actions/lesson.actions";
import { LoadMatter } from "../store/actions/matter.actions";
import { LoadGroup } from "../store/actions/group.actions";
import { LoadStudent } from "../store/actions/student.actions";
import { LoadScore } from "../store/actions/score.actions";
import { LoadNote } from "../store/actions/note.actions";
// config
import { API_URL, DB_SETTINGS, TABLE_SETTINGS } from "../configuration";
// selector
import { getState } from "../store/reducer";

@Injectable ()
export class OnlineService {
  isReady: boolean;
  isReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isOnline$:  Observable<boolean>;

  constructor (
    private _store: Store<AppState>,
    private _http: Http,
    public dataBase: AngularIndexedDB,
    public dbSettings: dataBaseSettings,
    public tables: tableSettings[]
  ) {
    this._openDataBase().then((data) => {
      this.isReady$.next(true);
      this.isReady$.complete();
    }, (error) => {
        console.error(error, ': store error: failed to open store');
    });
    this.isReady$.subscribe(value => {
      this.isReady = value;

      this.init();
    });
  }

  init () {
    if (this.isReady && window.localStorage['currentUser']) {
      let interval: any;

      this._store.select(getState).subscribe(state => {
        this.saveStateLocal(state);
      });
      this._updateState(this.isOnline());
      interval = this._updateEveryMs(300000);
      this.observeOnline().subscribe((value) => {

        if (value) {
          this._updateState(value);
          interval = this._updateEveryMs(300000);
        } else {
          clearInterval(interval);
        }
      });
    }
  }

  isOnline (): boolean {
    return navigator.onLine;
  }

  observeOnline (): Observable<boolean> {
    if (!this.isOnline$) {
      this.isOnline$ = Observable.merge(
        Observable.fromEvent (window, 'offline').map (() => false),
        Observable.fromEvent (window, 'online').map (() => true),
      );
    }

    return this.isOnline$;
  }

  saveStateLocal(state: AppState) {
    this.dataBase.update('state', state, 1).then(
      () => {},
      (error) => {
        console.error(error, ': store error: failed to save state');
      }
    );
  }

  private _updateState(isOnline) {
    if (isOnline) {
      this.sendAllDeferredRequest().then(() => {
        this._loadDataFromServer().subscribe(
          (state) => {
            this._updateStore(state);
          },
          (error) => {
            console.error(error.toString(), ': store : can`t load data from server');
          }
        );
      });
    } else {
      this._loadDataFromLocal().then(
        (state) => {
          this._updateStore(state);
        },
        (error) => {
          console.error(error, ': store : can`t get data from indexedDb');
        }
      );
    }
  }

  private _updateEveryMs(time): any {
    return setInterval(() => {
      this._updateState(this.isOnline());
    }, time);
  }

  addDeferredRequest(isOnline: boolean, method: string, url: string, options?: RequestOptionsArgs): Promise<any> {
    if (isOnline) {
      return new Promise(() => false);
    }

    let request: DeferredRequest = {
      method,
      url,
      time: new Date().getTime(),
    };

    if (options) {
      request = Object.assign(request, { options });
    }

    return this.dataBase.add('syncQueue', request).catch((error) => {
        console.error(error, ': store error: failed to save deferred request');
      }
    );
  }

  addWithBodyDeferredRequest(isOnline: boolean, method: string, url: string, body: any, options?: RequestOptionsArgs): Promise<boolean> {
    if (isOnline) {
      return;
    }
    let request: DeferredRequest = {
      method,
      url,
      time: new Date().getTime(),
    };

    request = Object.assign(request, { body });

    if (options) {
      request = Object.assign(request, { options });
    }

    return this.dataBase.add('syncQueue', request).then(() => true, (error) => {
        console.error(error, ': store error: failed to save deferred request');
      }
    );
  }

  sendAllDeferredRequest(): Promise<boolean> {
    return this.dataBase.getAll('syncQueue').then((requests: DeferredRequest[]) => {
      const allRequestsPromiseArr = [];

      requests
        .sort((requestPrev, requestNext) => requestPrev.time - requestNext.time)
        .forEach((request: DeferredRequest) => {
          allRequestsPromiseArr.push(this._sendDeferredRequest(request));
        });

      return Promise.all(allRequestsPromiseArr)
        .then((result: boolean[]) => result.every((item) => item));
    }, (error) => {
      console.error(error, ': store error: failed to send all deferred requests');
      return false;
    });
  }

  deleteAllDeferredRequest(): Promise<boolean> {
    return this.dataBase.clear('syncQueue').catch((error) => {
        console.error(error, ': store error: failed to delete all deferred requests');
      });
  }

  private _updateStore(state: AppState): void {
    this._store.dispatch(new LoadLesson(state.lessons));
    this._store.dispatch(new LoadMatter(state.matters));
    this._store.dispatch(new LoadGroup(state.groups));
    this._store.dispatch(new LoadStudent(state.students));
    this._store.dispatch(new LoadScore(state.scores));
    this._store.dispatch(new LoadNote(state.notes));
  }

  private _loadDataFromLocal(): Promise<AppState> {
    return this.dataBase.getByKey('state', 1);
  }

  private _loadDataFromServer(): any {
    const emptyState: AppState = {
      user: undefined,
      connection: { isWait: false },
      matters: [],
      lessons: [],
      groups: [],
      students: [],
      scores: [],
      notes: [],
      filter: null,
    };

    return this._http.get(`${API_URL}/db`).map((res: Response) => {
      const userData: string = localStorage.getItem('currentUser');
      const data = res.json();

      emptyState.user = userData !== null ? new User(JSON.parse(userData)) : null;
      emptyState.matters = data.matters.map(matter => new Matter(matter));
      emptyState.groups = data.groups.map(group => new Group(group));
      emptyState.students = data.students.map(student => new Student(student));
      emptyState.lessons = data.lessons.map(lesson => {
          data.date = new Date(lesson.date);

          return new Lesson(lesson);
      });
      emptyState.scores = data.scores.map(score => {
          data.date = new Date(score.date);

          return new Score(score);
      });
      emptyState.notes = data.notes.map(note => {
          data.date = new Date(note.date);

          return new Note(note);
      });

      return emptyState;
    });
  }

  private _sendDeferredRequest(request: DeferredRequest): Promise<boolean> {
    const argumentsArr: any[] = [];

    argumentsArr.push(request.url);
    if (request['body']) {
      argumentsArr.push(request['body']);
    }
    if (request['options']) {
      argumentsArr.push(request['options']);
    }

    return this._http[request.method](...argumentsArr).toPromise().then(
      () => {
        this.dataBase.delete('syncQueue', request.time)
          .then(
            () => true,
            (error) => console.error(error, ': database error: can`t remove item')
          )
      },
      (error) => console.error(error, ': http error')
    );
  }

  private _openDataBase(): Promise<any> {

    return this.dataBase.openDatabase(this.dbSettings.version, (event) => {
      this.tables.forEach((table) => {
        this._addTable(event, table);
      });
    });
  }

  private _addTable(event: any, settings: tableSettings) {
    const settingsObject = {
      keyPath: settings.keyPath,
      autoIncrement: settings.autoIncrement,
    };

    if (!settings.keyPath && !settings.autoIncrement) {
      event.currentTarget.result.createObjectStore(
        settings.name,
      );
    } else {
      event.currentTarget.result.createObjectStore(
        settings.name,
        settingsObject,
      );
    }
  }
}

export function onlineServiceFactory (store: Store<AppState>, http: Http): OnlineService {
  return new OnlineService(store, http, new AngularIndexedDB(DB_SETTINGS.name, DB_SETTINGS.version), DB_SETTINGS, TABLE_SETTINGS);
}

export interface dataBaseSettings {
  name: string;
  version: number;
}

export interface tableSettings {
  name: string;
  keyPath?: string;
  autoIncrement?: boolean;
}

export interface DeferredRequest {
  method: string;
  url: string;
  time: number;
}
