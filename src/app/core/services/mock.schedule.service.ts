// angular
import { Injectable } from '@angular/core';
// vendor
import { BehaviorSubject } from "rxjs/BehaviorSubject";
// models
import { Group } from "../models/group";
import { Lesson } from "../models/lesson";
import { Matter } from "../models/matter";
// testing data
import { groupArr, lessonArr, matterArr } from "../../helpers/data_for_tests";

@Injectable()
export class MockScheduleService {
  groups: BehaviorSubject<Group[]> = new BehaviorSubject(groupArr);
  lessons: BehaviorSubject<Lesson[]> = new BehaviorSubject(lessonArr);
  matters: BehaviorSubject<Matter[]> = new BehaviorSubject(matterArr);

  constructor() { }

  getLessons (): Lesson[] {
    return this.lessons.getValue();
  }

  addLesson(updatedLesson: Lesson): void {
    this.lessons.next(
      this.getLessons()
        .concat(updatedLesson)
        .sort((prev, next) => prev.date.getTime() - next.date.getTime())
    );
  }

  updateLesson(updatedLesson: Lesson): void {
    this.lessons.next(
      this.getLessons()
        .filter(lesson => lesson.id !== updatedLesson.id)
        .concat(updatedLesson)
        .sort((prev, next) => prev.date.getTime() - next.date.getTime())
    );
  }

  removeLesson(lessonId: string): void {
    this.lessons.next(
      this.getLessons()
        .filter(lesson => lesson.id !== lessonId)
        .sort((prev, next) => prev.date.getTime() - next.date.getTime())
    );
  }

  setJournalFilterData(data: any) {}
}
