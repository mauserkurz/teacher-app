// angular
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Directive, Input } from "@angular/core";
import { RouterTestingModule } from "@angular/router/testing";
// service
import { ScheduleService } from "../../services/schedule.service";
// component
import { ScheduleComponent } from './schedule.component';
// mock
import { MockScheduleService } from "../../services/mock.schedule.service";
// models
import { Matter } from "../../models/matter";
import { Lesson } from "../../models/lesson";
import { Group } from "../../models/group";
// actions
import { IFilterJournal } from "../../../store/actions/filter.actions";

@Directive({
  selector: 'app-lesson-view'
})
class MockLessonView {
  @Input() matters: Matter[];
  @Input() lessons: Lesson[];
  @Input() groups: Group[];
}

@Directive({
  selector: 'app-group-list'
})
class MockGroupList {
  @Input() groups: Group[];
}

describe('ScheduleComponent', () => {
  let component: ScheduleComponent;
  let fixture: ComponentFixture<ScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      declarations: [
        ScheduleComponent,
        MockLessonView,
        MockGroupList,
      ],
      providers: [
        { provide: ScheduleService, useClass: MockScheduleService }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should filter current lessons by group id and save given value', () => {
    component.filterLessons('1');

    expect(component.selectGroupId).toEqual('1');
    expect(component.currentLessons[0].groupIds).toEqual(['1']);
    expect(component.currentLessons[1].groupIds).toEqual(['1']);
    expect(component.currentLessons.length).toEqual(2);
  });

  it('should filter current lessons by id 0 to show all lessons', () => {
    component.filterLessons('0');

    expect(component.currentLessons.length).toEqual(component.lessons.length);
  });

  it('should trigger addLesson method of service for add new lesson', () => {
    spyOn<ScheduleService>(component.service, 'addLesson').and.callThrough();

    component.addLesson(new Lesson({ id: '4' }));
    expect(component.service.addLesson).toHaveBeenCalled();
  });

  it('should trigger updateLesson method of service for update certain lesson', () => {
    spyOn<ScheduleService>(component.service, 'updateLesson').and.callThrough();

    component.updateLesson(new Lesson({ id: '4' }));
    expect(component.service.updateLesson).toHaveBeenCalled();
  });

  it('should trigger removeLesson method of service for remove lesson by id', () => {
    spyOn<ScheduleService>(component.service, 'removeLesson').and.callThrough();

    component.removeLesson('1');
    expect(component.service.removeLesson).toHaveBeenCalled();
  });

  it('should trigger setJournalFilterData method of service for set data for rendering journal page', () => {
    const data: IFilterJournal = { groupId: '1', matterId: '1' };
    spyOn<ScheduleService>(component.service, 'setJournalFilterData').and.callThrough();

    component.setJournalFilterData(data);
    expect(component.service.setJournalFilterData).toHaveBeenCalledWith(data);
  });
});
