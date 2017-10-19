import { Component, HostBinding, OnInit } from '@angular/core';
import { ScheduleService } from "../../services/schedule.service";
import { Group } from "../../models/group";
import { Lesson } from "../../models/lesson";
import { Matter } from "../../models/matter";
import { IFilterJournal } from "../../../store/actions/filter.actions";

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  @HostBinding('class.raw') raw: boolean = true;
  selectGroupId: string = '0';
  groups: Group[];
  lessons: Lesson[];
  currentLessons: Lesson[];
  matters: Matter[];

  constructor(
    public service: ScheduleService
  ) {
    this.service
      .lessons
      .subscribe(value => {
        this.lessons = value;
        this.filterLessons(this.selectGroupId);
      });
    this.service
      .groups
      .subscribe(value => this.groups = value);
    this.service
      .matters
      .subscribe(value => this.matters = value);
  }

  ngOnInit() {
  }

  setJournalFilterData(data: IFilterJournal) {
    this.service.setJournalFilterData(data);
  }

  filterLessons (selectId: string): void {
    this.selectGroupId = selectId;

    if (selectId !== '0') {
      this.currentLessons = this.lessons
        .filter(lesson => lesson.groupIds.indexOf(selectId) > -1);
    } else {
      this.currentLessons = this.lessons;
    }
  }

  addLesson(lesson: Lesson): void {
    this.service.addLesson(lesson);
  }

  updateLesson(lesson: Lesson): void {
    this.service.updateLesson(lesson);
  }

  removeLesson(lessonId: string): void {
    this.service.removeLesson(lessonId);
  }
}
