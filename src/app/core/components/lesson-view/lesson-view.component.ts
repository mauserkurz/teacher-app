import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { Matter } from "../../models/matter";
import { Lesson } from "../../models/lesson";
import { Group } from "../../models/group";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";

@Component({
  selector: 'app-lesson-view',
  templateUrl: './lesson-view.component.html',
  styleUrls: ['./lesson-view.component.scss']
})
export class LessonViewComponent implements OnInit, OnChanges {
  @Input() matters: Matter[];
  @Input() lessons: Lesson[];
  @Input() groups: Group[];
  @Output() newLesson: EventEmitter<Lesson> = new EventEmitter();
  @Output() oldLesson: EventEmitter<Lesson> = new EventEmitter();
  @Output() removeLessonId: EventEmitter<string> = new EventEmitter();
  @Output() settingJournalFilter: EventEmitter<any> = new EventEmitter();
  lessonsPerDay: Map<any, any>;
  days: any[];
  preparedLesson: Lesson;

  constructor(
    private _router: Router,
    public modalService: NgbModal
  ) {}

  ngOnInit() {
    this.render();
  }

  ngOnChanges () {
    this.render();
  }

  render (): void {
    const draftMap: Map<any, any> = new Map;

    this.days = Array.from(new Set (
      this.lessons
        .map(lesson => {
          const date: Date = new Date(lesson.date.getTime());

          date.setHours(0);
          date.setMinutes(0);
          date.setSeconds(0);
          date.setMilliseconds(0);
          return date.getTime();
        })
      )
    ).map(time => new Date(time));

    for (let day of this.days) {
      draftMap.set(
        day,
        this.lessons
          .filter(lesson => {
            return lesson.date.getDay() === day.getDay() && lesson.date.getMonth() === day.getMonth()
          })
      );
    }

    this.lessonsPerDay = draftMap;
  }

  private _getGroupName (ids: string[]): string[] {
    const result: Group[] = this.groups.filter(group => ids.indexOf(group.id) > -1);
    return result.map(group => group.name);
  }

  private _getMatterName(ids: string[]): string[] {
    const result: Matter[] = this.matters.filter(matter => ids.indexOf(matter.id) > -1);
    return result.map(matter => matter.theme);
  }

  openModal(event: any, preparedLesson?: Lesson): void {
    this.preparedLesson = preparedLesson ? preparedLesson : null;
    this.modalService.open(event);
  }

  addLesson(lesson: Lesson): void {
    this.newLesson.next(lesson);
  }

  updateLesson(lesson: Lesson): void {
    this.oldLesson.next(lesson);
  }

  removeLesson(lesson: Lesson): void {
    this.removeLessonId.next(lesson.id);
  }

  filterJournal(groupId: string, matterId: string): Promise<any> {
    this.settingJournalFilter.next({ groupId, matterId });

    return this._router.navigate(['/core/journal']);
  }
}
