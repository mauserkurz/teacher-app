import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Note } from "../../models/note";
import * as uuid from "uuid/v4.js";

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.scss']
})
export class NoteFormComponent implements OnInit, OnChanges {
  @Input() notes: Note[];
  @Input() matterId: string;
  @Input() studentId: string;
  @Output() addNote$: EventEmitter<Note> = new EventEmitter();
  @Output() updateNote$: EventEmitter<Note> = new EventEmitter();
  @Output() removeNote$: EventEmitter<string> = new EventEmitter();
  showObj: any = {};
  renderNotes: Note[];

  constructor() {
  }

  ngOnInit() {
    this._render();
  }

  ngOnChanges(data) {
    this._render();
  }

  private _createNote(): Note {
    return new Note({
      id: uuid(),
      themeId: this.matterId,
      studentId: this.studentId,
      date: new Date(),
      text: 'Примечание',
    });
  }

  private _render(): void {
    const nextShowObj: any = {};

    this.renderNotes = [...this.notes];
    this.renderNotes.forEach(item => nextShowObj[item.id] = true);

    this.showObj = Object.assign(nextShowObj, this.showObj);
  }

  private _closeTextArea(noteId) {
    this.showObj[noteId] = true;
  }

  add(): void {
    this.addNote$.next(this._createNote());
  }

  update(note: Note) {
    this._closeTextArea(note.id);
    this.updateNote$.next(note);
  }

  remove(id: string): void {
    this.removeNote$.next(id);
  }
}
