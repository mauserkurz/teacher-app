// angular
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Component } from "@angular/core";
// vendor
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
// component
import { NoteFormComponent } from './note-form.component';
// models
import { Student } from "../../models/student";
import { Note } from "../../models/note";
// testing data
import { matterArr, noteArr, studentArr } from "../../../helpers/data_for_tests";

@Component({
  selector: 'component-wrapper',
  template: `
    <app-note-form
      [notes]="getNotesByStudentId(student.id)"
      [studentId]="student.id"
      [matterId]="selectedMatterId"
      (addNote$)="addNote($event)"
      (updateNote$)="updateNote($event)"
      (removeNote$)="removeNote($event)">
    </app-note-form>
  `
})

class ComponentWrapper {
  student: Student;
  selectedMatterId: string;

  constructor () {
    this.student = studentArr[0];
    this.selectedMatterId = matterArr[0].id;
  }

  getNotesByStudentId(studentId: string): Note[] {
    return noteArr.filter(note => note.studentId === studentId);
  }

  addNote(note: Note): void {}

  updateNote(note: Note): void {}

  removeNote(noteId: string): void {}
}


describe('NoteFormComponent', () => {
  let component: NoteFormComponent;
  let wrapper: ComponentWrapper;
  let fixture: ComponentFixture<ComponentWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
      ],
      declarations: [
        ComponentWrapper,
        NoteFormComponent,
      ]
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

  describe('method: add', () => {
    it('should emit new Note', () => {
      let receivedNote: Note;

      component.addNote$.subscribe(note => receivedNote = note);
      component.add();

      expect(receivedNote instanceof Note).toBeTruthy();
    });
  });

  describe('method: update', () => {
    it('should emit updated note', () => {
      const note: Note = noteArr[0];
      let receivedNote: Note;

      component.updateNote$.subscribe(note => receivedNote = note);
      component.update(note);

      expect(receivedNote).toEqual(note);
    });

    it('should turn show state of note to true', () => {
      const note: Note = noteArr[0];

      component.update(note);

      expect(component.showObj[note.id]).toBeTruthy();
    });
  });

  describe('method: remove', () => {
    it('should emit id of removed note', () => {
      const removeId: string = noteArr[0].id;
      let receivedNoteId: string;

      component.removeNote$.subscribe(note => receivedNoteId = note);
      component.remove(removeId);

      expect(receivedNoteId).toEqual(removeId);
    });
  });
});
