// angular
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Directive, EventEmitter, Input, Output } from "@angular/core";
import { RouterTestingModule } from "@angular/router/testing";
// service
import { JournalService } from "../../services/journal.service";
// component
import { JournalComponent } from './journal.component';
// models
import { Matter } from "../../models/matter";
import { Group } from "../../models/group";
import { Student } from "../../models/student";
import { Score } from "../../models/score";
import { Note } from "../../models/note";
// mock
import { MockJournalService } from "../../services/mock.journal.service";
import { noteArr, scoreArr } from "../../../helpers/data_for_tests";

@Directive({
  selector: 'app-journal-filter'
})
class MockJournalFilter {
  @Input() matters: Matter[];
  @Input() groups: Group[];
  @Input() initialSelectData: any;
  @Output() selectedData: EventEmitter<any> = new EventEmitter();
}

@Directive({
  selector: 'app-journal-view'
})
class MockJournalView {
  @Input() currentStudents: Student[];
  @Input() currentScores: Score[];
  @Input() currentNotes: Note[];
  @Input() selectedMatterId: string[];
  @Output() addNote$: EventEmitter<Note> = new EventEmitter();
  @Output() updateNote$: EventEmitter<Note> = new EventEmitter();
  @Output() removeNote$: EventEmitter<string> = new EventEmitter();
  @Output() updateScore$: EventEmitter<Score> = new EventEmitter();
}

describe('JournalComponent', () => {
  let component: JournalComponent;
  let fixture: ComponentFixture<JournalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      declarations: [
        MockJournalFilter,
        MockJournalView,
        JournalComponent,
      ],
      providers: [
        { provide: JournalService, useClass: MockJournalService }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('method: filterData', () => {
    it('should set argument.matterId as selectedMatterId', () => {
      const argument: any = {
        studentIds: ['1', '2', '3'],
        matterId: '1',
      };

      component.filterData(argument);

      expect(component.selectedMatterId).toEqual(argument.matterId);
    });

    it('should filter students by argument.studentIds and set as currentStudents', () => {
      const argument: any = {
        studentIds: ['1', '2', '3'],
        matterId: '1',
      };

      component.filterData(argument);

      expect(component.currentStudents.map(student => student.id)).toEqual(argument.studentIds);
    });

    it('should filter scores by ids of currentStudents, argument.matterId and set as currentNotes', () => {
      const argument: any = {
        studentIds: ['1', '2', '3'],
        matterId: '1',
      };

      component.filterData(argument);

      expect(
        component.currentScores.map(score => score.id)
      ).toEqual(
        scoreArr
          .filter(score => {
            return score.themeId === argument.matterId
              && argument.studentIds.indexOf(score.studentId) > -1;
          })
          .map(score => score.id)
      );
    });

    it('should filter notes by ids of currentStudents, argument.matterId and set as currentNotes', () => {
      const argument: any = {
        studentIds: ['1', '2', '3'],
        matterId: '1',
      };

      component.filterData(argument);

      expect(
        component.currentNotes.map(note => note.id)
      ).toEqual(
        noteArr
          .filter(note => {
            return note.themeId === argument.matterId
              && argument.studentIds.indexOf(note.studentId) > -1;
          })
          .map(note => note.id)
      );
    });

    it('should return false when attribute`s matterId is empty string', () => {
      const argument: any = {
        studentIds: ['1', '2', '3'],
        matterId: '',
      };

      expect(component.filterData(argument)).toBeFalsy();
    });

    it('should return false when attribute`s studentIds is empty string', () => {
      const argument: any = {
        studentIds: '',
        matterId: '1',
      };

      expect(component.filterData(argument)).toBeFalsy();
    });

    it('should return true when attribute`s fields are not empty string', () => {
      const argument: any = {
        studentIds: ['1', '2', '3'],
        matterId: '1',
      };

      expect(component.filterData(argument)).toBeTruthy();
    });
  });

  describe('method: addNote', () => {
    it('should call addNote method of service with same argument', () => {
      spyOn<JournalService>(component.service, 'addNote').and.callThrough();

      component.addNote(noteArr[0]);
      expect(component.service.addNote).toHaveBeenCalledWith(noteArr[0]);
    });
  });

  describe('method: updateNote', () => {
    it('should call updateNote method of service with same argument', () => {
      spyOn<JournalService>(component.service, 'updateNote').and.callThrough();

      component.updateNote(noteArr[0]);
      expect(component.service.updateNote).toHaveBeenCalledWith(noteArr[0]);
    });
  });

  describe('method: removeNote', () => {
    it('should call removeNote method of service with same argument', () => {
      spyOn<JournalService>(component.service, 'removeNote').and.callThrough();

      component.removeNote(noteArr[0].id);
      expect(component.service.removeNote).toHaveBeenCalledWith(noteArr[0].id);
    });
  });

  describe('method: updateScore', () => {
    it('should call updateScore method of service with same argument', () => {
      spyOn<JournalService>(component.service, 'updateScore').and.callThrough();

      component.updateScore(scoreArr[0]);
      expect(component.service.updateScore).toHaveBeenCalledWith(scoreArr[0]);
    });
  });

  describe('method: changeFilter', () => {
    it('should call changeFilter method of service with same argument', () => {
      const data = {
        matterId: '1',
        studentIds: ['1', '2', '3', '4', '5'],
        groupId: '1',
      };
      spyOn<JournalService>(component.service, 'changeFilter').and.callThrough();

      component.changeFilter(data);
      expect(component.service.changeFilter).toHaveBeenCalledWith(data);
    });
  });
});
