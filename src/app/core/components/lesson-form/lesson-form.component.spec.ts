// angular
import { async, ComponentFixture, TestBed, } from '@angular/core/testing';
import { Component, } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// vendor
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
// component
import { LessonFormComponent } from './lesson-form.component';
// models
import { Lesson } from "../../models/lesson";
import { Group } from "../../models/group";
import { Matter } from "../../models/matter";
// testing data
import { groupArr, lessonArr, matterArr } from "../../../helpers/data_for_tests";

@Component({
  selector: 'component-wrapper',
  template: `
    <app-lesson-form
          [groups]="groups"
          [lessons]="lessons"
          [matters]="matters"
          (addedLesson)="addLesson($event)"
          (updatedLesson)="updateLesson($event)"
          [updateLesson]="preparedLesson">
    </app-lesson-form>
  `
})

class ComponentWrapper {
  matters: Matter[];
  lessons: Lesson[];
  groups: Group[];
  preparedLesson: Lesson;

  constructor () {
    this.matters = matterArr;
    this.lessons = lessonArr;
    this.groups = groupArr;
  }

  addLesson(lesson: Lesson): void {}

  updateLesson(lesson: Lesson): void {}
}

describe('LessonFormComponent', () => {
  let component: LessonFormComponent;
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
        LessonFormComponent,
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
    expect(component.defaultData).toEqual(
      {
        themeId: '1',
        place: '',
        groupIds: [true, false, false],
        date: {
          year: new Date().getFullYear(),
          month:  new Date().getMonth() + 1,
          day: new Date().getDate(),
        },
        time: {
          hour: new Date().getHours(),
          minute: new Date().getMinutes(),
        },
        subscription: '',
      }
    );
  });

  it('should prepared to update given lesson', () => {
    wrapper.preparedLesson = new Lesson({
      id: '4',
      themeId: '1',
      place: '10',
      groupIds: ['2'],
      date: new Date(2017, 8, 29, 10, 0),
      subscription: '...',
    });
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.defaultData).toEqual(
      {
        themeId: '1',
        place: '10',
        groupIds: [false, true, false],
        date: {
          year: 2017,
          month: 9,
          day: 29,
        },
        time: {
          hour: 10,
          minute: 0,
        },
        subscription: '...',
      }
    );
  });

  it('should reset form to default value', () => {
    component.form.setValue({
      themeId: '2',
      place: '10',
      groupIds: [false, true, false],
      date: {
        year: 2017,
        month: 9,
        day: 29,
      },
      time: {
        hour: 10,
        minute: 0,
      },
      subscription: '...',
    });

    component.resetForm();
    expect(component.form.value).toEqual(component.defaultData);
  });

  it('should submit if form is valid and send data', () => {
    const data = {
      themeId: '2',
      place: '10',
      groupIds: [false, true, false],
      date: {
        year: 2017,
        month: 9,
        day: 29,
      },
      time: {
        hour: 10,
        minute: 0,
      },
      subscription: '...',
    };
    const expectedLesson: Lesson = new Lesson({
      themeId: '2',
      place: '10',
      groupIds: ['2'],
      date: new Date(2017, 8, 29, 10, 0),
      subscription: '...',
    });
    let createdLesson: Lesson;

    component.addedLesson.subscribe(value => createdLesson = value);
    component.form.setValue(data);

    expect(component.form.valid).toBeTruthy();

    component.onSubmit(data);
    expect(createdLesson.id).toBeTruthy();
    expect(createdLesson.themeId).toEqual(expectedLesson.themeId);
    expect(createdLesson.place).toEqual(expectedLesson.place);
    expect(createdLesson.groupIds).toEqual(expectedLesson.groupIds);
    expect(createdLesson.date).toEqual(expectedLesson.date);
    expect(createdLesson.subscription).toEqual(expectedLesson.subscription);
  });

  it('should on submit if wrapper input has updateLesson set old id to generated lesson', () => {
    const data = {
      themeId: '2',
      place: '10',
      groupIds: [false, true, false],
      date: {
        year: 2017,
        month: 9,
        day: 29,
      },
      time: {
        hour: 10,
        minute: 0,
      },
      subscription: '...',
    };
    let createdLesson: Lesson;

    component.updatedLesson.subscribe(value => createdLesson = value);
    wrapper.preparedLesson = new Lesson({
      id: '4',
      themeId: '1',
      place: '10',
      groupIds: ['2'],
      date: new Date(2017, 8, 29, 10, 0),
      subscription: '...',
    });
    fixture.detectChanges();
    component.ngOnInit();
    component.form.setValue(data);

    component.onSubmit(data);
    expect(component.form.valid).toBeTruthy();
    expect(createdLesson.id).toEqual(wrapper.preparedLesson.id);
  });

  it('should on submit if form invalid mark as touched placeField', () => {
    component.onSubmit(component.defaultData);

    expect(component.form.invalid).toBeTruthy();
    expect(component.placeField.touched).toBeTruthy();
  });
});
