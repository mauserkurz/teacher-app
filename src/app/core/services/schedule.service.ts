// angular
import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
// vendor
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import { Store } from "@ngrx/store";
// service
import { OnlineService } from "../../common/online.service";
// models
import { Group } from "../models/group";
import { Lesson } from "../models/lesson";
import { Matter } from "../models/matter";
// state
import { AppState } from "../../store/state/app.state";
// actions
import { AddLesson, UpdateLesson, RemoveLesson } from "../../store/actions/lesson.actions";
import { FilterJournal, IFilterJournal } from "../../store/actions/filter.actions";
// selectors
import { getGroups } from "../../store/reducers/group.reducer";
import { getLessons } from "../../store/reducers/lesson.reducer";
import { getMatters } from "../../store/reducers/matter.reducer";
// config
import { API_URL } from "../../configuration";

@Injectable()
export class ScheduleService {
  groups: Store<Group[]> = this._store.select(getGroups);
  lessons: Observable<Lesson[]> = this._store.select(getLessons).map(data => {
    if (data.length === 0) {
      return data;
    }
    return data
      .map(lesson => {
        if (lesson.date.constructor.name !== 'Date') {
          lesson.date = new Date(lesson.date);
        }

        return lesson;
      })
      .sort((prev, next) => prev.date.getTime() - next.date.getTime());
  });
  matters: Store<Matter[]> = this._store.select(getMatters);
  currentGroups: Group[];
  currentLessons: Lesson[];
  currentMatters: Matter[];

  constructor(
    private _http: Http,
    private _store: Store<AppState>,
    private _online: OnlineService
  ) {
    this.groups.subscribe(value => this.currentGroups = value);
    this.lessons.subscribe(value => this.currentLessons = value);
    this.matters.subscribe(value => this.currentMatters = value);
  }

  addLesson(lesson: Lesson): void {
    if (this._online.isOnline()) {
      this._http.post(`${API_URL}/lessons`, lesson)
        .subscribe(
          ()=> {
            this._store.dispatch(
              new AddLesson( lesson )
            );
          },
          (error) => console.error(error, 'http error: can`t post lesson')
        );
    } else {
      this._store.dispatch(
        new AddLesson( lesson )
      );
      this._online.addWithBodyDeferredRequest(this._online.isOnline(), 'post', `${API_URL}/lessons`, lesson);
    }
  }

  updateLesson(lesson: Lesson): void {
    if (this._online.isOnline()) {
      this._http.put(`${API_URL}/lessons/${lesson.id}`, lesson)
        .subscribe(
          ()=> {
            this._store.dispatch(
              new UpdateLesson( lesson )
            );
          },
          (error) => console.error(error, 'http error: can`t update lesson')
        );
    } else {
      this._store.dispatch(
        new UpdateLesson( lesson )
      );
      this._online.addWithBodyDeferredRequest(this._online.isOnline(), 'put', `${API_URL}/lessons/${lesson.id}`, lesson);
    }
  }

  removeLesson(lessonId: string): void {
    if (this._online.isOnline()) {
      this._http.delete(`${API_URL}/lessons/${lessonId}`)
        .subscribe(
          ()=> {
            this._store.dispatch(
              new RemoveLesson( lessonId )
            );
          },
          (error) => console.error(error, 'http error: can`t post lesson')
        );
    } else {
      this._store.dispatch(
        new RemoveLesson( lessonId )
      );
      this._online.addDeferredRequest(this._online.isOnline(), 'delete', `${API_URL}/lessons/${lessonId}`);
    }
  }

  setJournalFilterData(data: IFilterJournal) {
    this._store.dispatch(
      new FilterJournal( data )
    );
  }
}
