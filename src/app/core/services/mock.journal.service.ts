// angular
import { Injectable } from '@angular/core';
// vendor
import { BehaviorSubject } from "rxjs/BehaviorSubject";
// models
import { Student } from "../models/student";
import { Score } from "../models/score";
import { Note } from "../models/note";
// testing data
import {
  groupArr, lessonArr, matterArr, noteArr, scoreArr,
  studentArr, user
} from "../../helpers/data_for_tests";
// state
import { AppState } from "../../store/state/app.state";
import { IFilterJournalData } from "../../store/reducer";

@Injectable()
export class MockJournalService {
  initStoreDate: AppState = {
    user: null,
    groups: [],
    students: [],
    lessons: [],
    matters: [],
    scores: [],
    notes: [],
    connection: { isWait: false },
    filter: { groupId: '', matterId: '' },
  };

  storeData: AppState = {
    user: user,
    groups: groupArr,
    students: studentArr,
    lessons: lessonArr,
    matters: matterArr,
    scores: scoreArr,
    notes: noteArr,
    connection: { isWait: false },
    filter: { groupId: '', matterId: '' },
  };

  storeData$: BehaviorSubject<AppState> = new BehaviorSubject(this.initStoreDate);

  constructor() {
    this.storeData$.next(this.storeData);
  }

  changeFilter(data: IFilterJournalData) {
    const state: AppState = this.storeData$.getValue();

    state.filter = {
      groupId: data.groupId,
      matterId: data.matterId,
    };

    this.storeData$.next(state);
  }

  addNote(note: Note) {
    const state: AppState = this.storeData$.getValue();
    const student: Student = state.students
      .find(student => student.id === note.studentId);

    state.notes = state.notes
      .concat(note);
    student.noteIds = student.noteIds
      .filter(noteId => noteId !== note.id)
      .concat(note.id);

    this.storeData$.next(state);
  }

  updateNote(note: Note) {
    const state: AppState = this.storeData$.getValue();

    state.notes = state.notes
      .filter(currentNote => currentNote.id !== note.id)
      .concat(note);

    this.storeData$.next(state);
  }

  removeNote(noteId: string) {
    const state: AppState = this.storeData$.getValue();
    const student: Student = state.students
      .find(student => student.id === noteId);

    state.notes = state.notes
      .filter(currentNote => currentNote.id !== noteId);
    student.noteIds = student.noteIds
      .filter(noteId => noteId !== noteId);

    this.storeData$.next(state);
  }

  updateScore(score: Score) {
    const state: AppState = this.storeData$.getValue();

    state.scores = state.scores
      .filter(currentScore => currentScore.id !== score.id)
      .concat(score);

    this.storeData$.next(state);
  }
}
