// angular
import { TestBed, inject } from '@angular/core/testing';
import { Http, HttpModule, XHRBackend } from "@angular/http";
import { MockBackend } from "@angular/http/testing";
// vendor
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/of";
import "rxjs/add/observable/throw";
import { Store, StoreModule } from "@ngrx/store";
// services
import { ScheduleService } from './schedule.service';
import { OnlineService } from "../../common/online.service";
// actions
import { AddLesson, RemoveLesson, UpdateLesson } from "../../store/actions/lesson.actions";
import { FilterJournal, IFilterJournal } from "../../store/actions/filter.actions";
// reducer
import { rootReducer } from "../../store/reducer";
// mock
import { MockStore } from "../../store/mock.store";
import { MockOnlineService } from "../../common/mock.online.service";
// testing data
import { filterData, lessonArr } from "../../helpers/data_for_tests";
// config
import { API_URL } from "../../configuration";

describe('ScheduleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        StoreModule.forRoot(rootReducer),
      ],
      providers: [
        ScheduleService,
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
          useClass: MockOnlineService,
        }
      ],
    });
  });

  it('should be created', inject([ScheduleService], (service: ScheduleService) => {
    expect(service).toBeTruthy();
  }));

  describe('method: addLesson', () => {
    it('should post lesson to server and save it in store when app is online', inject([ScheduleService, OnlineService, Http, Store], (service: ScheduleService, online: MockOnlineService, http: Http, store: MockStore) => {
      spyOn<Http>(http, 'post').and.callFake(() => Observable.of(true));
      spyOn<MockStore>(store, 'dispatch').and.callThrough();
      service.addLesson(lessonArr[0]);

      expect(online.isOnline()).toBeTruthy();
      expect(http.post).toHaveBeenCalledWith(`${API_URL}/lessons`, lessonArr[0]);
      expect(store.dispatch).toHaveBeenCalledWith(new AddLesson(lessonArr[0]));
    }));

    it('should handle error after try to post lesson', inject([ScheduleService, OnlineService, Http], (service: ScheduleService, online: MockOnlineService, http: Http) => {
      const testError: any = new Error('test error');
      spyOn<Http>(http, 'post').and.callFake(() => Observable.throw(testError));
      spyOn<any>(window.console, 'error');
      service.addLesson(lessonArr[0]);

      expect(online.isOnline()).toBeTruthy();
      expect(http.post).toHaveBeenCalledWith(`${API_URL}/lessons`, lessonArr[0]);
      expect(window.console.error).toHaveBeenCalledWith(testError, 'http error: can`t post lesson');
    }));

    it('should save lesson in store when app is offline', inject([ScheduleService, OnlineService, Store], (service: ScheduleService, online: MockOnlineService, store: MockStore) => {
      spyOn<MockStore>(store, 'dispatch').and.callThrough();
      online.online = false;
      service.addLesson(lessonArr[0]);

      expect(online.isOnline()).toBeFalsy();
      expect(store.dispatch).toHaveBeenCalledWith(new AddLesson(lessonArr[0]));
    }));

    it('should create deferred request for post lesson when app will stand online when app is offline', inject([ScheduleService, OnlineService], (service: ScheduleService, online: MockOnlineService) => {
      spyOn<MockOnlineService>(online, 'addWithBodyDeferredRequest').and.callThrough();
      online.online = false;
      service.addLesson(lessonArr[0]);

      expect(online.isOnline()).toBeFalsy();
      expect(online.addWithBodyDeferredRequest).toHaveBeenCalledWith(online.isOnline(), 'post', `${API_URL}/lessons`, lessonArr[0]);
    }));
  });

  describe('method: updateLesson', () => {
    it('should put lesson to server and update it in store when app is online', inject([ScheduleService, OnlineService, Http, Store], (service: ScheduleService, online: MockOnlineService, http: Http, store: MockStore) => {
      spyOn<Http>(http, 'put').and.callFake(() => Observable.of(true));
      spyOn<MockStore>(store, 'dispatch').and.callThrough();
      service.updateLesson(lessonArr[0]);

      expect(online.isOnline()).toBeTruthy();
      expect(http.put).toHaveBeenCalledWith(`${API_URL}/lessons/${lessonArr[0].id}`, lessonArr[0]);
      expect(store.dispatch).toHaveBeenCalledWith(new UpdateLesson(lessonArr[0]));
    }));

    it('should handle error after try to put lesson', inject([ScheduleService, OnlineService, Http], (service: ScheduleService, online: MockOnlineService, http: Http) => {
      const testError: any = new Error('test error');
      spyOn<Http>(http, 'put').and.callFake(() => Observable.throw(testError));
      spyOn<any>(window.console, 'error');
      service.updateLesson(lessonArr[0]);

      expect(online.isOnline()).toBeTruthy();
      expect(http.put).toHaveBeenCalledWith(`${API_URL}/lessons/${lessonArr[0].id}`, lessonArr[0]);
      expect(window.console.error).toHaveBeenCalledWith(testError, 'http error: can`t update lesson');
    }));

    it('should update lesson in store when app is offline', inject([ScheduleService, OnlineService, Store], (service: ScheduleService, online: MockOnlineService, store: MockStore) => {
      spyOn<MockStore>(store, 'dispatch').and.callThrough();
      online.online = false;
      service.updateLesson(lessonArr[0]);

      expect(online.isOnline()).toBeFalsy();
      expect(store.dispatch).toHaveBeenCalledWith(new UpdateLesson(lessonArr[0]));
    }));

    it('should create deferred request for put lesson when app will stand online when app is offline', inject([ScheduleService, OnlineService], (service: ScheduleService, online: MockOnlineService) => {
      spyOn<MockOnlineService>(online, 'addWithBodyDeferredRequest').and.callThrough();
      online.online = false;
      service.updateLesson(lessonArr[0]);

      expect(online.isOnline()).toBeFalsy();
      expect(online.addWithBodyDeferredRequest).toHaveBeenCalledWith(online.isOnline(), 'put', `${API_URL}/lessons/${lessonArr[0].id}`, lessonArr[0]);
    }));
  });

  describe('method: removeLesson', () => {
    it('should delete lesson from server and from store when app is online', inject([ScheduleService, OnlineService, Http, Store], (service: ScheduleService, online: MockOnlineService, http: Http, store: MockStore) => {
      spyOn<Http>(http, 'delete').and.callFake(() => Observable.of(true));
      spyOn<MockStore>(store, 'dispatch').and.callThrough();
      service.removeLesson(lessonArr[0].id);

      expect(online.isOnline()).toBeTruthy();
      expect(http.delete).toHaveBeenCalledWith(`${API_URL}/lessons/${lessonArr[0].id}`);
      expect(store.dispatch).toHaveBeenCalledWith(new RemoveLesson(lessonArr[0].id));
    }));

    it('should handle error after try to delete lesson', inject([ScheduleService, OnlineService, Http], (service: ScheduleService, online: MockOnlineService, http: Http) => {
      const testError: any = new Error('test error');
      spyOn<Http>(http, 'delete').and.callFake(() => Observable.throw(testError));
      spyOn<any>(window.console, 'error');
      service.removeLesson(lessonArr[0].id);

      expect(online.isOnline()).toBeTruthy();
      expect(http.delete).toHaveBeenCalledWith(`${API_URL}/lessons/${lessonArr[0].id}`);
      expect(window.console.error).toHaveBeenCalledWith(testError, 'http error: can`t post lesson');
    }));

    it('should delete lesson from store when app is offline', inject([ScheduleService, OnlineService, Store], (service: ScheduleService, online: MockOnlineService, store: MockStore) => {
      spyOn<MockStore>(store, 'dispatch').and.callThrough();
      online.online = false;
      service.removeLesson(lessonArr[0].id);

      expect(online.isOnline()).toBeFalsy();
      expect(store.dispatch).toHaveBeenCalledWith(new RemoveLesson(lessonArr[0].id));
    }));

    it('should create deferred request for delete lesson when app will stand online when app is offline', inject([ScheduleService, OnlineService], (service: ScheduleService, online: MockOnlineService) => {
      spyOn<MockOnlineService>(online, 'addDeferredRequest').and.callThrough();
      online.online = false;
      service.removeLesson(lessonArr[0].id);

      expect(online.isOnline()).toBeFalsy();
      expect(online.addDeferredRequest).toHaveBeenCalledWith(online.isOnline(), 'delete', `${API_URL}/lessons/${lessonArr[0].id}`);
    }));
  });

  describe('method: setJournalFilterData', () => {
    it('should dispatch filter data to store', inject([ScheduleService, Store], (service: ScheduleService, store: MockStore) => {
      const data: IFilterJournal = filterData;
      spyOn<MockStore>(store, 'dispatch').and.callThrough();

      service.setJournalFilterData(data);

      expect(store.dispatch).toHaveBeenCalledWith(new FilterJournal(data));
    }));
  });
});
