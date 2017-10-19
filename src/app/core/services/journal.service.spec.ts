// angular
import { TestBed, inject } from '@angular/core/testing';
import { Http, HttpModule, XHRBackend } from "@angular/http";
import { MockBackend } from "@angular/http/testing";
// vendor
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';
import { Store, StoreModule } from "@ngrx/store";
// service
import { JournalService } from './journal.service';
import { OnlineService } from "../../common/online.service";
// reducer
import { IFilterJournalData, rootReducer } from "../../store/reducer";
// actions
import { UpdateScore } from "../../store/actions/score.actions";
import { AddNote, RemoveNote, UpdateNote } from "../../store/actions/note.actions";
import { UpdateStudent } from "../../store/actions/student.actions";
// mocks
import { MockStore } from "../../store/mock.store";
import { MockOnlineService } from "../../common/mock.online.service";
// testing data
import { noteArr, scoreArr, studentArr } from "../../helpers/data_for_tests";
import { API_URL } from "../../configuration";
import { FilterJournal } from "../../store/actions/filter.actions";

describe('JournalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        StoreModule.forRoot(rootReducer),
      ],
      providers: [
        JournalService,
        {
           provide: Store,
           useClass: MockStore,
        },
        {
          provide: XHRBackend,
          useClass: MockBackend
        },
        {
          provide: OnlineService,
          useClass: MockOnlineService
        }
      ],
    });
  });

  it('should be created', inject([JournalService], (service: JournalService) => {
    expect(service).toBeTruthy();
  }));

  describe('method: addNote', () => {
    it('should post note to server and save it in store when app is online', inject([JournalService, OnlineService, Http, Store], (service: JournalService, online: MockOnlineService, http: Http, store: MockStore) => {
      spyOn<Http>(http, 'post').and.callFake(() => Observable.of(true));
      spyOn<Http>(http, 'put').and.callFake(() => Observable.of(true));
      spyOn<MockStore>(store, 'dispatch').and.callThrough();
      service.addNote(noteArr[0]);

      expect(online.isOnline()).toBeTruthy();
      expect(http.post).toHaveBeenCalledWith(`${API_URL}/notes`, noteArr[0]);
      expect(store.dispatch).toHaveBeenCalledWith(new AddNote(noteArr[0]));
    }));

    it('should put updated student which depend on added note to server and save it in store when app is online', inject([JournalService, OnlineService, Http, Store], (service: JournalService, online: MockOnlineService, http: Http, store: MockStore) => {
      spyOn<Http>(http, 'post').and.callFake(() => Observable.of(true));
      spyOn<Http>(http, 'put').and.callFake(() => Observable.of(true));
      spyOn<MockStore>(store, 'dispatch').and.callThrough();
      service.addNote(noteArr[0]);

      expect(online.isOnline()).toBeTruthy();
      expect(store.fakeState.students[0].noteIds.indexOf(noteArr[0].id) > -1).toBeTruthy();
      expect(http.put).toHaveBeenCalledWith(`${API_URL}/students/${studentArr[0].id}`, studentArr[0]);
      expect(store.dispatch).toHaveBeenCalledWith(new UpdateStudent(studentArr[0]));
    }));

    it('should handle error after try to post note', inject([JournalService, OnlineService, Http], (service: JournalService, online: MockOnlineService, http: Http) => {
      const testError: any = new Error('test error');
      spyOn<Http>(http, 'post').and.callFake(() => Observable.throw(testError));
      spyOn<any>(window.console, 'error');
      service.addNote(noteArr[0]);

      expect(online.isOnline()).toBeTruthy();
      expect(http.post).toHaveBeenCalledWith(`${API_URL}/notes`, noteArr[0]);
      expect(window.console.error).toHaveBeenCalledWith(testError, 'http error: can`t post note');
    }));

    it('should save note in store when app is offline', inject([JournalService, OnlineService, Store], (service: JournalService, online: MockOnlineService, store: MockStore) => {
      spyOn<MockStore>(store, 'dispatch').and.callThrough();
      online.online = false;
      service.addNote(noteArr[0]);

      expect(online.isOnline()).toBeFalsy();
      expect(store.dispatch).toHaveBeenCalledWith(new AddNote(noteArr[0]));
    }));

    it('should save updated student in store when app is offline', inject([JournalService, OnlineService, Store], (service: JournalService, online: MockOnlineService, store: MockStore) => {
      spyOn<MockStore>(store, 'dispatch').and.callThrough();
      online.online = false;
      service.addNote(noteArr[0]);

      expect(online.isOnline()).toBeFalsy();
      expect(store.dispatch).toHaveBeenCalledWith(new UpdateStudent(studentArr[0]));
    }));

    it('should create deferred request for post note when app will stand online when app is offline', inject([JournalService, OnlineService], (service: JournalService, online: MockOnlineService) => {
      spyOn<MockOnlineService>(online, 'addWithBodyDeferredRequest').and.callThrough();
      online.online = false;
      service.addNote(noteArr[0]);

      expect(online.isOnline()).toBeFalsy();
      expect(online.addWithBodyDeferredRequest).toHaveBeenCalledWith(online.isOnline(), 'post', `${API_URL}/notes`, noteArr[0]);
    }));

    it('should create deferred request for put updated student when app will stand online when app is offline', inject([JournalService, OnlineService], (service: JournalService, online: MockOnlineService) => {
      spyOn<MockOnlineService>(online, 'addWithBodyDeferredRequest').and.callThrough();
      online.online = false;
      service.addNote(noteArr[0]);

      expect(online.isOnline()).toBeFalsy();
      expect(online.addWithBodyDeferredRequest).toHaveBeenCalledWith(
        online.isOnline(),
        'put',
        `${API_URL}/students/${studentArr[0].id}`,
        studentArr[0]
      );
    }));
  });

  describe('method: updateNote', () => {
    it('should put note to server and update it in store when app is online', inject([JournalService, Http, Store, OnlineService], (service: JournalService, http: Http, store: MockStore, online: MockOnlineService) => {
      spyOn<Http>(http, 'put').and.callFake(() => Observable.of(true));
      spyOn<MockStore>(store, 'dispatch').and.callThrough();
      service.updateNote(noteArr[0]);

      expect(online.isOnline()).toBeTruthy();
      expect(http.put).toHaveBeenCalledWith(`${API_URL}/notes/${noteArr[0].id}`, noteArr[0]);
      expect(store.dispatch).toHaveBeenCalledWith(new UpdateNote(noteArr[0]));
    }));

    it('should handle error after try to put note', inject([JournalService, OnlineService, Http], (service: JournalService, online: MockOnlineService, http: Http) => {
      const testError: any = new Error('test error');
      spyOn<Http>(http, 'put').and.callFake(() => Observable.throw(testError));
      spyOn<any>(window.console, 'error');
      service.updateNote(noteArr[0]);

      expect(online.isOnline()).toBeTruthy();
      expect(http.put).toHaveBeenCalledWith(`${API_URL}/notes/${noteArr[0].id}`, noteArr[0]);
      expect(window.console.error).toHaveBeenCalledWith(testError, 'http error: can`t update note');
    }));

    it('should update note in store when app is offline', inject([JournalService, OnlineService, Store], (service: JournalService, online: MockOnlineService, store: MockStore) => {
      spyOn<MockStore>(store, 'dispatch').and.callThrough();
      online.online = false;
      service.updateNote(noteArr[0]);

      expect(online.isOnline()).toBeFalsy();
      expect(store.dispatch).toHaveBeenCalledWith(new UpdateNote(noteArr[0]));
    }));

    it('should create deferred request for put note when app will stand online when app is offline', inject([JournalService, OnlineService], (service: JournalService, online: MockOnlineService) => {
      spyOn<MockOnlineService>(online, 'addWithBodyDeferredRequest').and.callThrough();
      online.online = false;
      service.updateNote(noteArr[0]);

      expect(online.isOnline()).toBeFalsy();
      expect(online.addWithBodyDeferredRequest).toHaveBeenCalledWith(online.isOnline(), 'put', `${API_URL}/notes/${noteArr[0].id}`, noteArr[0]);
    }));
  });

  describe('method: removeNote', () => {
    beforeEach(() => {
      studentArr[0].noteIds = studentArr[0].noteIds.filter(noteId => noteId !== '1').concat('1');
    });

    it('should delete note from server and save it in store when app is online', inject([JournalService, OnlineService, Http, Store], (service: JournalService, online: MockOnlineService, http: Http, store: MockStore) => {
      spyOn<Http>(http, 'delete').and.callFake(() => Observable.of(true));
      spyOn<Http>(http, 'put').and.callFake(() => Observable.of(true));
      spyOn<MockStore>(store, 'dispatch').and.callThrough();
      service.removeNote(noteArr[0].id);

      expect(online.isOnline()).toBeTruthy();
      expect(http.delete).toHaveBeenCalledWith(`${API_URL}/notes/${noteArr[0].id}`);
      expect(store.dispatch).toHaveBeenCalledWith(new RemoveNote(noteArr[0].id));
    }));

    it('should put updated student which depend on removed note to server and save it in store when app is online', inject([JournalService, OnlineService, Http, Store], (service: JournalService, online: MockOnlineService, http: Http, store: MockStore) => {
      spyOn<Http>(http, 'delete').and.callFake(() => Observable.of(true));
      spyOn<Http>(http, 'put').and.callFake(() => Observable.of(true));
      spyOn<MockStore>(store, 'dispatch').and.callThrough();
      service.removeNote(noteArr[0].id);

      expect(online.isOnline()).toBeTruthy();
      expect(store.fakeState.students[0].noteIds.indexOf(noteArr[0].id) === -1).toBeTruthy();
      expect(http.put).toHaveBeenCalledWith(`${API_URL}/students/${studentArr[0].id}`, studentArr[0]);
      expect(store.dispatch).toHaveBeenCalledWith(new UpdateStudent(studentArr[0]));
    }));

    it('should handle error after try to delete note', inject([JournalService, OnlineService, Http], (service: JournalService, online: MockOnlineService, http: Http) => {
      const testError: any = new Error('test error');
      spyOn<Http>(http, 'delete').and.callFake(() => Observable.throw(testError));
      spyOn<any>(window.console, 'error');
      service.removeNote(noteArr[0].id);

      expect(online.isOnline()).toBeTruthy();
      expect(http.delete).toHaveBeenCalledWith(`${API_URL}/notes/${noteArr[0].id}`);
      expect(window.console.error).toHaveBeenCalledWith(testError, 'http error: can`t delete note');
    }));

    it('should delete note from store when app is offline', inject([JournalService, OnlineService, Store], (service: JournalService, online: MockOnlineService, store: MockStore) => {
      spyOn<MockStore>(store, 'dispatch').and.callThrough();
      online.online = false;
      service.removeNote(noteArr[0].id);

      expect(online.isOnline()).toBeFalsy();
      expect(store.dispatch).toHaveBeenCalledWith(new RemoveNote(noteArr[0].id));
    }));

    it('should save updated student in store when app is offline', inject([JournalService, OnlineService, Store], (service: JournalService, online: MockOnlineService, store: MockStore) => {
      spyOn<MockStore>(store, 'dispatch').and.callThrough();
      online.online = false;
      service.removeNote(noteArr[0].id);

      expect(online.isOnline()).toBeFalsy();
      expect(store.dispatch).toHaveBeenCalledWith(new UpdateStudent(studentArr[0]));
    }));

    it('should create deferred request for removing note when app will stand online when app is offline', inject([JournalService, OnlineService], (service: JournalService, online: MockOnlineService) => {
      spyOn<MockOnlineService>(online, 'addDeferredRequest').and.callThrough();
      online.online = false;
      service.removeNote(noteArr[0].id);

      expect(online.isOnline()).toBeFalsy();
      expect(online.addDeferredRequest).toHaveBeenCalledWith(online.isOnline(), 'delete', `${API_URL}/notes/${noteArr[0].id}`);
    }));

    it('should create deferred request for put updated student when app will stand online when app is offline', inject([JournalService, OnlineService], (service: JournalService, online: MockOnlineService) => {
      spyOn<MockOnlineService>(online, 'addWithBodyDeferredRequest').and.callThrough();
      online.online = false;
      service.removeNote(noteArr[0].id);

      expect(online.isOnline()).toBeFalsy();
      expect(online.addWithBodyDeferredRequest).toHaveBeenCalledWith(
        online.isOnline(),
        'put',
        `${API_URL}/students/${studentArr[0].id}`,
        studentArr[0]
      );
    }));
  });

  describe('method: updateScore', () => {
    it('should put score to server and update it in store when app is online', inject([JournalService, Http, Store, OnlineService], (service: JournalService, http: Http, store: MockStore, online: MockOnlineService) => {
      spyOn<Http>(http, 'put').and.callFake(() => Observable.of(true));
      spyOn<MockStore>(store, 'dispatch').and.callThrough();
      service.updateScore(scoreArr[0]);

      expect(online.isOnline()).toBeTruthy();
      expect(http.put).toHaveBeenCalledWith(`${API_URL}/scores/${scoreArr[0].id}`, scoreArr[0]);
      expect(store.dispatch).toHaveBeenCalledWith(new UpdateScore(scoreArr[0]));
    }));

    it('should handle error after try to put score', inject([JournalService, OnlineService, Http], (service: JournalService, online: MockOnlineService, http: Http) => {
      const testError: any = new Error('test error');
      spyOn<Http>(http, 'put').and.callFake(() => Observable.throw(testError));
      spyOn<any>(window.console, 'error');
      service.updateScore(scoreArr[0]);

      expect(online.isOnline()).toBeTruthy();
      expect(http.put).toHaveBeenCalledWith(`${API_URL}/scores/${scoreArr[0].id}`, scoreArr[0]);
      expect(window.console.error).toHaveBeenCalledWith(testError, 'http error: can`t update score');
    }));

    it('should update score in store when app is offline', inject([JournalService, OnlineService, Store], (service: JournalService, online: MockOnlineService, store: MockStore) => {
      spyOn<MockStore>(store, 'dispatch').and.callThrough();
      online.online = false;
      service.updateScore(scoreArr[0]);

      expect(online.isOnline()).toBeFalsy();
      expect(store.dispatch).toHaveBeenCalledWith(new UpdateScore(scoreArr[0]));
    }));

    it('should create deferred request for put score when app will stand online when app is offline', inject([JournalService, OnlineService], (service: JournalService, online: MockOnlineService) => {
      spyOn<MockOnlineService>(online, 'addWithBodyDeferredRequest').and.callThrough();
      online.online = false;
      service.updateScore(scoreArr[0]);

      expect(online.isOnline()).toBeFalsy();
      expect(online.addWithBodyDeferredRequest).toHaveBeenCalledWith(online.isOnline(), 'put', `${API_URL}/scores/${scoreArr[0].id}`, scoreArr[0]);
    }));
  });

  describe('method: changeFilter', () => {
    it('should dispatch action with data for rendering journal view', inject([JournalService, Store], (service: JournalService, store: MockStore) => {
      const data: IFilterJournalData = {
        groupId: '1',
        matterId: '1',
        studentIds: ['1', '2', '3', '4', '5'],
      };
      spyOn<MockStore>(store, 'dispatch').and.callThrough();

      service.changeFilter(data);
      expect(store.dispatch).toHaveBeenCalledWith(new FilterJournal({
        groupId: data.groupId,
        matterId: data.matterId
      }));
    }));
  });
});
