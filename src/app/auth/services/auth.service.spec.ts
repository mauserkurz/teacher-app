// angular
import {
  HttpModule,
  ResponseOptions,
  Response,
  XHRBackend
} from "@angular/http";
import { TestBed, inject } from '@angular/core/testing';
import { MockBackend } from "@angular/http/testing";
// vendor
import { Store } from "@ngrx/store";
// service
import { AuthService } from './auth.service';
import { OnlineService } from "../../common/online.service";
// mock
import { MockStore } from "../../store/mock.store";
import { MockOnlineService } from "../../common/mock.online.service";
// testing data
import { user } from "../../helpers/data_for_tests";
// model
import { User } from "../models/user";
// actions
import { DeleteUser, SaveUser } from "../../store/actions/user.actions";
import { RemoveAllGroup } from "../../store/actions/group.actions";
import { RemoveAllLesson } from "../../store/actions/lesson.actions";
import { RemoveAllMatter } from "../../store/actions/matter.actions";
import { RemoveAllNote } from "../../store/actions/note.actions";
import { RemoveAllScore } from "../../store/actions/score.actions";
import { RemoveAllStudent } from "../../store/actions/student.actions";

describe('AuthService', () => {
  beforeEach(()=> {
    window.localStorage.removeItem('currentUser');
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
      ],
      providers: [
        { provide: Store, useClass: MockStore },
        { provide: XHRBackend, useClass: MockBackend },
        { provide: OnlineService, useClass: MockOnlineService },
        AuthService,
      ]
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));

  describe('method: login', () => {
    it('should return stream with logged user', inject([AuthService, Store, XHRBackend], (service: AuthService, store: MockStore, back: MockBackend) => {
      const mockResponse = [user];
      let receivedUser: User;

      back.connections.subscribe(connection => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse),
        })));
      });

      service.login(user.login, user.pathHash).subscribe(value => receivedUser = value);
      expect(receivedUser).toEqual(mockResponse[0]);
    }));

    it('should set user as currentUser in localStorage', inject([AuthService, Store, XHRBackend], (service: AuthService, store: MockStore, back: MockBackend) => {
      const mockResponse = [user];
      spyOn<MockStore>(store, 'dispatch').and.callThrough();

      back.connections.subscribe(connection => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse),
        })));
      });

      expect(window.localStorage.getItem('currentUser')).toBeFalsy();

      service.login(user.login, user.pathHash).subscribe(() => {});
      expect(window.localStorage.getItem('currentUser')).toEqual(JSON.stringify(user));
    }));

    it('should dispatch user to store', inject([AuthService, Store, XHRBackend], (service: AuthService, store: MockStore, back: MockBackend) => {
      const mockResponse = [user];
      spyOn<MockStore>(store, 'dispatch').and.callThrough();

      back.connections.subscribe(connection => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse),
        })));
      });

      service.login(user.login, user.pathHash).subscribe(() => {});

      expect(store.dispatch).toHaveBeenCalledWith(new SaveUser(user));
    }));
  });

  describe('method: initAuth', () => {
    it('should get currentUser from local storage', inject([AuthService], (service: AuthService) => {
      spyOn<any>(window.localStorage, 'getItem').and.callThrough();

      service.initAuth();
      expect(window.localStorage.getItem).toHaveBeenCalledWith('currentUser');
    }));

    it('should send action to add user in store and return true', inject([AuthService, Store], (service: AuthService, store: MockStore) => {
      window.localStorage.setItem('currentUser', JSON.stringify(user));
      spyOn<MockStore>(store, 'dispatch').and.callThrough();

      expect(service.initAuth()).toBeTruthy();
      expect(store.dispatch).toHaveBeenCalledWith(new SaveUser(new User(user)));
    }));
  });

  describe('method: logout', () => {
    it('should remove current user from local storage', inject([AuthService], (service: AuthService) => {
      window.localStorage.setItem('currentUser', JSON.stringify(user));
      service.logout();

      expect(window.localStorage.getItem('currentUser')).toBeFalsy();
    }));

    it('should remove all user related data from store', inject([AuthService, Store], (service: AuthService, store: MockStore) => {
      spyOn<MockStore>(store, 'dispatch').and.callThrough();
      service.logout();

      expect(store.dispatch).toHaveBeenCalledWith(new DeleteUser);
      expect(store.dispatch).toHaveBeenCalledWith(new RemoveAllGroup);
      expect(store.dispatch).toHaveBeenCalledWith(new RemoveAllLesson);
      expect(store.dispatch).toHaveBeenCalledWith(new RemoveAllMatter);
      expect(store.dispatch).toHaveBeenCalledWith(new RemoveAllNote);
      expect(store.dispatch).toHaveBeenCalledWith(new RemoveAllScore);
      expect(store.dispatch).toHaveBeenCalledWith(new RemoveAllStudent);
    }));

    it('should call deleteAllDeferredRequest for clearing syncQueue object store', inject([AuthService, OnlineService], (service: AuthService, online: MockOnlineService) => {
      spyOn<MockOnlineService>(online, 'deleteAllDeferredRequest').and.callThrough();
      service.logout();

      expect(online.deleteAllDeferredRequest).toHaveBeenCalled();
    }));
  });
});
