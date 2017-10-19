// angular
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Directive, Input } from "@angular/core";
import { RouterTestingModule } from "@angular/router/testing";
// vendor
import { NgbModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
// component
import { LessonViewComponent } from './lesson-view.component';
// models
import { Group } from "../../models/group";
import { Lesson } from "../../models/lesson";
import { Matter } from "../../models/matter";
// testing data
import { groupArr, lessonArr, matterArr } from "../../../helpers/data_for_tests";

@Component({
  selector: 'component-wrapper',
  template: `
    <app-lesson-view
        [groups]="groups"
        [lessons]="lessons"
        [matters]="matters"
        (newLesson)="sendLesson($event)"
        (removeLessonId)="removeLesson($event)">
    </app-lesson-view>
  `
})

class ComponentWrapper {
  groups: Group[];
  lessons: Lesson[];
  matters: Matter[];

  constructor () {
    this.groups = groupArr;
    this.lessons = lessonArr;
    this.matters = matterArr;
  }

  sendLesson(newLesson: Lesson): void {}

  removeLesson(removeLessonId: string): void {}
}

@Directive({
  selector: 'app-lesson-form'
})
class MockLessonForm {
  @Input() updateLesson: Lesson;
  @Input() matters: Matter[];
  @Input() lessons: Lesson[];
  @Input() groups: Group[];
}

describe('LessonViewComponent', () => {
  let component: LessonViewComponent;
  let wrapper: ComponentWrapper;
  let fixture: ComponentFixture<ComponentWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgbModule.forRoot(),
      ],
      declarations: [
        LessonViewComponent,
        ComponentWrapper,
        MockLessonForm,
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

  describe('method: addLesson', () => {
    it('should output new lesson', () => {
      const sendingLesson: Lesson = new Lesson({
        id: '4',
        themeId: '1',
        place: '10',
        groupIds: ['1'],
        date: new Date(2017, 8, 29, 10, 0),
        subscription: '...',
      });
      let receivingLesson: Lesson;

      component.newLesson.subscribe(lesson => receivingLesson = lesson);
      component.addLesson(sendingLesson);
      expect(receivingLesson).toEqual(sendingLesson);
    });
  });

  describe('method: updateLesson', () => {
    it('should output updated lesson', () => {
      const sendingLesson: Lesson = new Lesson({
        id: '4',
        themeId: '1',
        place: '10',
        groupIds: ['1'],
        date: new Date(2017, 8, 29, 10, 0),
        subscription: '...',
      });
      let receivingLesson: Lesson;

      component.oldLesson.subscribe(lesson => receivingLesson = lesson);
      component.updateLesson(sendingLesson);
      expect(receivingLesson).toEqual(sendingLesson);
    });
  });

  describe('method: removeLesson', () => {
    it('should output id of removed lesson', () => {
      const removedLesson: Lesson = new Lesson({
        id: '4',
        themeId: '1',
        place: '10',
        groupIds: ['1'],
        date: new Date(2017, 8, 29, 10, 0),
        subscription: '...',
      });
      let receivedId: string;

      component.removeLessonId.subscribe(lessonId => receivedId = lessonId);
      component.removeLesson(removedLesson);
      expect(receivedId).toEqual(removedLesson.id);
    });
  });

  describe('method: openModal', () => {
    it('should trigger open on modal service', () => {
      spyOn<NgbModal>(component.modalService, 'open');

      component.openModal(new Event('click'));
      expect(component.modalService.open).toHaveBeenCalled();
    });

    it('should open modal window for add lesson', () => {
      const element: Element = fixture.nativeElement;
      let modal: Element;

      element.querySelector('.btn.badge-info').dispatchEvent(new Event('click'));
      expect(document.querySelector('.modal-backdrop ')).toBeTruthy();
    });

    it('should open modal window for update lesson', () => {
      const element: Element = fixture.nativeElement;
      let modal: Element;

      element.querySelector('.edit-btn').dispatchEvent(new Event('click'));
      expect(component.updateLesson).toBeTruthy();
      expect(document.querySelector('.modal-backdrop ')).toBeTruthy();
    });
  });

  describe('method: filterJournal', () => {
    it('should emit data for settings of initial filter in journal and redirect', () => {
      const data: any = {
        groupId: '1',
        matterId: '1'
      };
      let receivedValue: any;

      component.settingJournalFilter.subscribe(value => receivedValue = value);

      component.filterJournal(data.groupId, data.matterId).catch(() => {});

      expect(receivedValue).toEqual(data);
    });
  });
});
