// angular
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
// vendor
import { Subscription } from "rxjs/Subscription";
// service
import { JournalService } from "../../services/journal.service";
// models
import { Student } from "../../models/student";
import { Note } from "../../models/note";
import { Score } from "../../models/score";
// state
import { AppState } from "../../../store/state/app.state";
import { IFilterJournalData } from "../../../store/reducer";
import { IFilterJournal } from "../../../store/actions/filter.actions";

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit, OnDestroy {
  @HostBinding('class.container') container: boolean = true;
  private _subscription: Subscription = new Subscription();
  storeData: AppState;
  initialSelectData: IFilterJournal;
  selectedMatterId: string;
  currentStudents: Student[];
  currentScores: Score[];
  currentNotes: Note[];

  constructor( public service: JournalService ) {
    this._subscription.add(
      this.service.storeData$
        .subscribe(state => {
          this.storeData = state;

          if (!this._dataIsFull()) {
            return;
          }

          let data: any = {
            studentIds: '',
            matterId: '',
          };

          if (this.storeData.filter.matterId) {
            data.matterId = this.selectedMatterId = this.storeData.filter.matterId;
            data.studentIds = this._getStudentIds(this.storeData.filter.groupId);
          } else if (this.storeData.matters[0].id) {
            data.matterId = this.selectedMatterId = this.storeData.matters[0].id;
            data.studentIds = this._getStudentIds(this.storeData.groups[0].id);
          }

          this.initialSelectData = state.filter;
          this.filterData(data);
        })
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  private _getStudentIds(groupId: string): string[] {
    return [...this.storeData.groups.find(group => group.id === groupId).studentIds];
  }

  private _dataIsFull (): boolean {
    return this.storeData.students.length > 0
      && this.storeData.notes.length > 0
      && this.storeData.scores.length > 0
      && this.storeData.matters.length > 0
      && this.storeData.groups.length > 0;
  }

  changeFilter(data: IFilterJournalData) {
    this.service.changeFilter(data);
  }

  filterData(data: any): boolean {
    const noteIds: string[] = [];
    const scoreIds: string[] = [];

    if (data.matterId === '' || data.studentIds === '') {
      return false;
    }

    this.currentStudents = this.storeData.students
      .filter(student => data.studentIds.indexOf(student.id) > -1);

    this.currentStudents.forEach(student => {
      noteIds.push(...student.noteIds);
      scoreIds.push(...student.scoreIds);
    });

    this.currentNotes = this.storeData.notes
      .filter(
        note => noteIds.indexOf(note.id) > -1
          && note.themeId === data.matterId
      );

    this.currentScores = this.storeData.scores
      .filter(
        score => scoreIds.indexOf(score.id) > -1
          && score.themeId === data.matterId
      );

    return true;
  }

  updateScore(score: Score): void {
    this.service.updateScore(score);
  }

  addNote(note: Note): void {
    this.service.addNote(note);
  }

  updateNote(note: Note): void {
    this.service.updateNote(note);
  }

  removeNote(noteId: string): void {
    this.service.removeNote(noteId);
  }
}
