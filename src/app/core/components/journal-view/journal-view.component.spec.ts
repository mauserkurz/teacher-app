// angular
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Directive, Input } from "@angular/core";
import { JournalViewComponent } from './journal-view.component';
import { RouterTestingModule } from "@angular/router/testing";
// vendor
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
// models
import { Score } from "../../models/score";
import { Student } from "../../models/student";
import { Note } from "../../models/note";
// testing data
import { matterArr, noteArr, scoreArr, studentArr } from "../../../helpers/data_for_tests";

@Component({
  selector: 'component-wrapper',
  template: `
    <app-journal-view
      [currentStudents]="currentStudents"
      [currentScores]="currentScores"
      [currentNotes]="currentNotes"
      [selectedMatterId]="selectedMatterId"
      (addNote$)="addNote($event)"
      (updateNote$)="updateNote($event)"
      (removeNote$)="removeNote($event)"
      (updateScore$)="updateScore($event)"
    ></app-journal-view>
  `
})

class ComponentWrapper {
  currentStudents: Student[];
  currentNotes: Note[];
  currentScores: Score[];
  selectedMatterId: string;

  constructor () {
    this.currentStudents = studentArr.slice(0, 3);
    this.selectedMatterId = matterArr[0].id;
    this.currentNotes = noteArr
      .filter(note => {
        return this.currentStudents.map(student => student.id).indexOf(note.studentId) > -1
          && note.themeId === this.selectedMatterId;
      });
    this.currentScores = scoreArr
      .filter(score => {
        return this.currentStudents.map(student => student.id).indexOf(score.studentId) > -1
          && score.themeId === this.selectedMatterId;
      });
  }

  addNote(note: Note): void {}

  updateNote(note: Note): void {}

  removeNote(noteId: string): void {}

  updateScore(score: Score): void {}
}

@Directive({
  selector: 'app-note-form'
})
class MockNoteForm {
  @Input() notes: Note[];
  @Input() studentId: string;
  @Input() matterId: string;
}

@Directive({
  selector: 'app-score-form'
})
class MockScoreForm {
  @Input() score: Score;
}

describe('JournalViewComponent', () => {
  let component: JournalViewComponent;
  let wrapper: ComponentWrapper;
  let fixture: ComponentFixture<ComponentWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgbModule.forRoot(),
      ],
      declarations: [
        ComponentWrapper,
        JournalViewComponent,
        MockNoteForm,
        MockScoreForm,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentWrapper);
    wrapper = fixture.componentInstance;
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('method: addNote', () => {
    it('should emit added note', () => {
      const note: Note = noteArr[0];
      let receivingNote: Note;

      component.addNote$.subscribe(note => receivingNote = note);
      component.addNote(note);
      expect(receivingNote).toEqual(note);
    });
  });

  describe('method: updateNote', () => {
    it('should emit updated note', () => {
      const note: Note = noteArr[0];
      let receivingNote: Note;

      component.updateNote$.subscribe(note => receivingNote = note);
      component.updateNote(note);
      expect(receivingNote).toEqual(note);
    });
  });

  describe('method: removeNote', () => {
    it('should emit id of removed note', () => {
      const noteId: string = noteArr[0].id;
      let removeNoteId: string;

      component.removeNote$.subscribe(note => removeNoteId = note);
      component.removeNote(noteId);
      expect(removeNoteId).toEqual(noteId);
    });
  });

  describe('method: updateScore', () => {
    it('should emit updated score', () => {
      const score: Score = scoreArr[0];
      let receivingScore: Score;

      component.updateScore$.subscribe(note => receivingScore = note);
      component.updateScore(score);
      expect(receivingScore).toEqual(score);
    });
  });
});
