// angular
import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
// vendor
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/takeLast';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { Store } from "@ngrx/store";
// service
import { OnlineService } from "../../common/online.service";
// models
import { Note } from "../models/note";
import { Score } from "../models/score";
import { Student } from "../models/student";
// state
import { AppState } from "../../store/state/app.state";
// actions
import { AddNote, RemoveNote, UpdateNote } from "../../store/actions/note.actions";
import { UpdateStudent } from "../../store/actions/student.actions";
import { UpdateScore } from "../../store/actions/score.actions";
// selector
import { getState, IFilterJournalData } from "../../store/reducer";
// config
import { API_URL } from "../../configuration";
import { FilterJournal } from "../../store/actions/filter.actions";

@Injectable()
export class JournalService {
  storeData: AppState;
  storeData$: Observable<AppState> = this._store.select(getState)
    .map(state => {
      if (state.notes.length > 0) {
        state.notes = state.notes
          .map(note => {
            if (note.date.constructor.name !== 'Date') {
              note.date = new Date(note.date);
            }

            return note;
          })
          .sort((prev, next) => prev.date.getTime() - next.date.getTime());
      }

      if (state.scores.length > 0) {
        state.scores = state.scores
          .map(score => {
            if (score.date.constructor.name !== 'Date') {
              score.date = new Date(score.date);
            }

            return score;
          })
          .sort((prev, next) => prev.date.getTime() - next.date.getTime());
      }

      return state;
  });

  constructor(
    private _http: Http,
    private _store: Store<AppState>,
    private _online: OnlineService
  ) {
    this.storeData$.subscribe(state => this.storeData = state);
  }

  changeFilter(data: IFilterJournalData) {
    this._store.dispatch(new FilterJournal({
      groupId: data.groupId,
      matterId: data.matterId,
    }));
  }

  addNote(note: Note) {
    const updatedStudent: Student = this.storeData.students.find(student => student.id === note.studentId);

    updatedStudent.noteIds = [...updatedStudent.noteIds].filter(noteId => noteId !== note.id).concat(note.id);

    if (this._online.isOnline()) {
      const requests: Observable<any>[] = [];

      requests.push(this._http.post(`${API_URL}/notes`, note));
      requests.push(this._http.put(`${API_URL}/students/${updatedStudent.id}`, updatedStudent));

      Observable.merge(...requests).takeLast(1)
        .subscribe(
          ()=> {
            this._store.dispatch(
              new AddNote( note )
            );
            this._store.dispatch(
              new UpdateStudent( updatedStudent )
            );
          },
          (error) => console.error(error, 'http error: can`t post note')
        );
    } else {
      this._online.addWithBodyDeferredRequest(this._online.isOnline(), 'post', `${API_URL}/notes`, note);

      this._store.dispatch(
        new AddNote( note )
      );

      this._online.addWithBodyDeferredRequest(this._online.isOnline(), 'put', `${API_URL}/students/${updatedStudent.id}`, updatedStudent);

      this._store.dispatch(
        new UpdateStudent( updatedStudent )
      );
    }}

  updateNote(note: Note) {
    if (this._online.isOnline()) {
      this._http.put(`${API_URL}/notes/${note.id}`, note)
        .subscribe(
          ()=> {
            this._store.dispatch(
              new UpdateNote( note )
            );
          },
          (error) => console.error(error, 'http error: can`t update note')
        );
    } else {
      this._store.dispatch(
        new UpdateNote( note )
      );

      this._online.addWithBodyDeferredRequest(this._online.isOnline(), 'put', `${API_URL}/notes/${note.id}`, note);
    }}

  removeNote(noteId: string) {
    const updatedStudent: Student = this.storeData.students.find(student => student.noteIds.indexOf(noteId) > -1);

    updatedStudent.noteIds = [...updatedStudent.noteIds].filter(note => note !== noteId);

    if (this._online.isOnline()) {
      const requests: Observable<any>[] = [];

      requests.push(this._http.delete(`${API_URL}/notes/${noteId}`));
      requests.push(this._http.put(`${API_URL}/students/${updatedStudent.id}`, updatedStudent));

      Observable.merge(...requests).takeLast(1)
        .subscribe(
          ()=> {
            this._store.dispatch(
              new RemoveNote( noteId )
            );
            this._store.dispatch(
              new UpdateStudent( updatedStudent )
            );
          },
          (error) => console.error(error, 'http error: can`t delete note')
        );
    } else {
      this._online.addDeferredRequest(this._online.isOnline(), 'delete', `${API_URL}/notes/${noteId}`);

      this._store.dispatch(
        new RemoveNote( noteId )
      );

      this._online.addWithBodyDeferredRequest(this._online.isOnline(), 'put', `${API_URL}/students/${updatedStudent.id}`, updatedStudent);

      this._store.dispatch(
        new UpdateStudent( updatedStudent )
      );
    }
  }

  updateScore(score: Score) {
    if (this._online.isOnline()) {
      this._http.put(`${API_URL}/scores/${score.id}`, score)
        .subscribe(
          ()=> {
            this._store.dispatch(
              new UpdateScore( score )
            );
          },
          (error) => console.error(error, 'http error: can`t update score')
        );
    } else {
      this._store.dispatch(
        new UpdateScore( score )
      );

      this._online.addWithBodyDeferredRequest(this._online.isOnline(), 'put', `${API_URL}/scores/${score.id}`, score);
    }
  }
}
