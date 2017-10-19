import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Student } from "../../models/student";
import { Score } from "../../models/score";
import { Note } from "../../models/note";

@Component({
  selector: 'app-journal-view',
  templateUrl: './journal-view.component.html',
  styleUrls: ['./journal-view.component.scss']
})
export class JournalViewComponent implements OnInit {
  @Input() currentStudents: Student[];
  @Input() currentScores: Score[];
  @Input() currentNotes: Note[];
  @Input() selectedMatterId: string;
  @Output() addNote$: EventEmitter<Note> = new EventEmitter();
  @Output() updateNote$: EventEmitter<Note> = new EventEmitter();
  @Output() removeNote$: EventEmitter<string> = new EventEmitter();
  @Output() updateScore$: EventEmitter<Score> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  getScoresByStudentId(studentId: string): Score[] {
    return this.currentScores.filter(score => score.studentId === studentId);
  }

  getNotesByStudentId(studentId: string): Note[] {
    return this.currentNotes.filter(note => note.studentId === studentId);
  }

  getDates(scores: Score[]): Date[] {
    const map: number[] = scores.map(score => score.date.getTime());

    return Array.from(new Set(map)).map(unix => new Date(unix));
  }

  getMonths(dates: Date[]): number[] {
    const map: number[] = dates.map(date => date.getMonth());

    return Array.from(new Set(map));
  }

  getDateFromMonth(month: number): Date {
    return new Date(new Date().getFullYear(), month);
  }

  getDaysInMonth(dates: Date[], month: number): number {
    return dates
      .map(date => date.getMonth())
      .filter(itemMonth => itemMonth === month)
      .length;
  }

  addNote(note: Note): void {
    this.addNote$.next(note);
  }

  updateNote(note: Note): void {
    this.updateNote$.next(note);
  }

  removeNote(noteId: string): void {
    this.removeNote$.next(noteId);
  }

  updateScore(score: Score): void {
    this.updateScore$.next(score);
  }
}
