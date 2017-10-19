// angular
import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
// vendor
import * as uuid from 'uuid/v4.js';
// models
import { Lesson } from "../../models/lesson";
import { Group } from "../../models/group";
import { Matter } from "../../models/matter";

@Component({
  selector: 'app-lesson-form',
  templateUrl: './lesson-form.component.html',
  styleUrls: ['./lesson-form.component.scss']
})
export class LessonFormComponent implements OnInit {
  @HostBinding('class.raw') raw: boolean = true;
  @Input() updateLesson: Lesson;
  @Input() matters: Matter[];
  @Input() lessons: Lesson[];
  @Input() groups: Group[];
  @Output() addedLesson: EventEmitter<Lesson> = new EventEmitter();
  @Output() updatedLesson: EventEmitter<Lesson> = new EventEmitter();

  form: FormGroup;
  matterField: AbstractControl;
  placeField: AbstractControl;
  groupsField: AbstractControl;
  dateField: AbstractControl;
  timeField: AbstractControl;
  subscriptionField: AbstractControl;
  defaultData: any = {
    themeId: null,
    place: '',
    groupIds: null,
    date: null,
    time: null,
    subscription: '',
  };

  constructor(
    private fb: FormBuilder
  ) {
    this.form = fb.group({
      'themeId': [
        '',
        Validators.required,
      ],
      'place': [
        '',
        Validators.required,
      ],
      'date': [
        '',
        Validators.required,
      ],
      'time': [
        '',
        Validators.required,
      ],
      'subscription': [
        '',
      ],
    });

    this.matterField = this.form.controls['themeId'];
    this.placeField = this.form.controls['place'];
    this.dateField = this.form.controls['date'];
    this.timeField = this.form.controls['time'];
    this.subscriptionField = this.form.controls['subscription'];
  }

  private _todayDate (): any {
    const now: Date = new Date;

    return {
      year: now.getFullYear(),
      month: (now.getMonth() + 1),
      day: now.getDate(),
    };
  }

  private _todayTime (): any {
    const now: Date = new Date;

    return {
      hour: now.getHours(),
      minute: now.getMinutes(),
    };
  }

  private _initGroupsState (groups: Group[], initGroups?: string[]): boolean[] {
    let arr = groups.map((group, index) => index === 0);

    if (initGroups) {
      const groupIds = groups.map(group => group.id);
      arr = groupIds.map((group) => initGroups.indexOf(group) > -1);
    }

    return arr;
  }

  private _buildGroups () {
    const arr = this.groups.map(() => {
      return this.fb.control(false);
    });
    return this.fb.array(arr);
  }

  ngOnInit() {
    if (this.updateLesson) {
      this.defaultData.themeId = this.updateLesson.themeId;
      this.defaultData.place = this.updateLesson.place;
      this.defaultData.groupIds = this._initGroupsState(this.groups, this.updateLesson.groupIds);
      this.defaultData.subscription = this.updateLesson.subscription;

      this.defaultData.date = {
        year: this.updateLesson.date.getFullYear(),
        month: (this.updateLesson.date.getMonth() + 1),
        day: this.updateLesson.date.getDate(),
      };

      this.defaultData.time = {
        hour: this.updateLesson.date.getHours(),
        minute: this.updateLesson.date.getMinutes(),
      };
    } else {
      this.defaultData.themeId = this.matters[0].id;
      this.defaultData.groupIds = this._initGroupsState(this.groups);
      this.defaultData.date = this._todayDate();
      this.defaultData.time = this._todayTime();
    }

    this.form.addControl('groupIds', this._buildGroups());
    this.groupsField = this.form.controls['groupIds'];
    this.form.setValue(this.defaultData);
  }

  onSubmit (data: any): void {
    const currentData: any = Object.assign({}, data);

    if (this.form.valid) {
      currentData.groupIds = this.groups
        .map(group => group.id)
        .filter((id, index) => currentData.groupIds[index]);
      currentData.date = new Date(
        Number(currentData.date.year),
        Number(currentData.date.month) - 1,
        Number(currentData.date.day),
        Number(currentData.time.hour),
        Number(currentData.time.minute),
      );

      delete currentData.time;

      if (this.updateLesson) {
        this.updatedLesson
          .next(
            Object.assign(
              this.updateLesson,
              currentData
            )
          );
      } else {
        this.addedLesson
          .next(
            Object.assign(
              new Lesson ({ id: uuid() }),
              currentData
            )
          );
      }

      this.resetForm();
    } else {
      if (this.placeField.errors) {
        this.placeField.markAsTouched();
      }
    }
  }

  resetForm (): void {
    this.form.reset(this.defaultData);
  }
}
