// angular
import { TestBed, inject, async } from '@angular/core/testing';
import { MockBackend } from "@angular/http/testing";
import {
  BaseRequestOptions,
  ConnectionBackend,
  Http,
  HttpModule,
  ResponseOptions,
  Response,
} from "@angular/http";
// vendor
import { Store } from "@ngrx/store";
import { AngularIndexedDB } from "angular2-indexeddb";
// service
import { DeferredRequest, OnlineService, onlineServiceFactory } from './online.service';
// mock
import { MockStore } from "../store/mock.store";
// config
import { API_URL } from "../configuration";
// state
import { AppState } from "../store/state/app.state";
// testing data
import { user } from "../helpers/data_for_tests";

describe('OnlineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
      ],
      providers: [
        BaseRequestOptions,
        MockBackend,
        {
          provide: Store,
          useClass: MockStore,
        },
        {
          provide: Http,
          useFactory: (
            backend: ConnectionBackend,
            defaultOptions: BaseRequestOptions
          ) => {
            return new Http (backend, defaultOptions);
          },
          deps: [ MockBackend, BaseRequestOptions ]
        },
        {
          provide: OnlineService,
          useFactory: onlineServiceFactory,
          deps: [ Store, Http ],
        }
      ]
    });

    const requests: DeferredRequest[] = [
      {
        method: 'get',
        url: 'site.com/article/1',
        time: 1,
      },
      {
        method: 'get',
        url: 'site.com/article/2',
        time: 2,
      },
      {
        method: 'get',
        url: 'site.com/article/3',
        time: 3,
      }
    ];
    const service = TestBed.get(OnlineService);

    spyOn<AngularIndexedDB>(service.dataBase, 'add').and.callFake(() => new Promise(() => {}));
    spyOn<AngularIndexedDB>(service.dataBase, 'delete').and.callFake(() => new Promise(() => {}));
    spyOn<AngularIndexedDB>(service.dataBase, 'update').and.callFake(() => new Promise(() => {}));
    spyOn<AngularIndexedDB>(service.dataBase, 'clear').and.callFake(() => new Promise(() => {}));
    spyOn<AngularIndexedDB>(service.dataBase, 'getAll').and.callFake(() => new Promise(() => requests));
  });

  afterEach(async(() => {
      let delRequest = indexedDB.deleteDatabase ('store');
      delRequest.onsuccess = (event) => {};
      delRequest.onerror = (error) => {};
  }));

  it('should be created', inject([OnlineService, MockBackend, Store], (service: OnlineService, backend: MockBackend, store: MockStore) => {
      const createConnections = (backend: MockBackend, data: { url: string, receivedData: string }[] ) => {
        backend.connections.subscribe (connection => {
          expect(
            data
              .find((request) => request.url !== connection.request.url)
          ).toBeTruthy();

          const response: Response = new Response (
            new ResponseOptions ({
              body: data
                .find((request) => request.url === connection.request.url).receivedData
            })
          );

          connection.mockRespond (response);
        });
      };

      createConnections(backend, [
        {
          url: `${API_URL}/db`,
          receivedData: JSON.stringify(store.fakeState),
        },
        {
          url: `${API_URL}/lessons`,
          receivedData: JSON.stringify(store.fakeState.lessons),
        },
        {
          url: `${API_URL}/matters`,
          receivedData: JSON.stringify(store.fakeState.matters),
        },
        {
          url: `${API_URL}/groups`,
          receivedData: JSON.stringify(store.fakeState.groups),
        },
      ]);

      service.isReady$.subscribe(value => {
        if (value) {
          store.fakeData$.next(store.fakeState);
          Promise.all([
            service.addDeferredRequest(false, 'get', `${API_URL}/groups`),
          ]).then(() => {
            service.sendAllDeferredRequest().then(() => {
              expect(service).toBeTruthy();
            });
          });
        }
      });
    }));

  describe('method: init', () => {
    it('should start work of service', inject([OnlineService], (service: OnlineService) => {
       window.localStorage.setItem('currentUser', JSON.stringify(user));

      service.isReady$.subscribe(() => {
        service.init();
      });
    }));
  });

  describe('method: isOnline', () => {
    it('should return value of navigator.onLine', inject([OnlineService], (service: OnlineService) => {
      expect(service.isOnline()).toEqual(navigator.onLine);
    }));
  });

  describe('method: observeOnline', () => {
    it('should create observable of online/offline events', async(() => {
      inject([OnlineService], (service: OnlineService) => {
        service.observeOnline().subscribe(value => {
          expect (value).toEqual (navigator.onLine);
        });
      })();
    }));
  });

  describe('method: saveStateLocal', () => {
    it('should call update method of base for saving state in object store with name state, and key 1', inject([OnlineService], (service: OnlineService) => {
      const state: AppState = {
        user: null,
        connection: { isWait: false },
        lessons: [],
        matters: [],
        students: [],
        groups: [],
        notes: [],
        scores: [],
        filter: null,
      };
      service.isReady$.subscribe(() => {
        service.saveStateLocal(state);
        expect(service.dataBase.update).toHaveBeenCalledWith('state', state, 1);
      });
    }));
  });

  describe('method: addDeferredRequest', () => {
    it('should', inject([OnlineService], (service: OnlineService) => {
      service.isReady$.subscribe(() => {
        service.addDeferredRequest(false, 'get', 'site.com/article/1').then(() => {});
        expect(service.dataBase.add).toHaveBeenCalled();
      });
    }));
  });

  describe('method: addWithBodyDeferredRequest', () => {
    it('should', inject([OnlineService], (service: OnlineService) => {
      service.isReady$.subscribe(() => {
        service.addWithBodyDeferredRequest(false, 'get', 'site.com/article/1', '{ "val": 1 }').then(() => {});
        expect(service.dataBase.add).toHaveBeenCalled();
      });
    }));
  });

  describe('method: sendAllDeferredRequest', () => {
    it('should get all DeferredRequest from syncQueue object store and then send them one by one', inject([OnlineService], (service: OnlineService) => {
      service.isReady$.subscribe(() => {
        service.sendAllDeferredRequest().then(() => {});

        expect(service.dataBase.getAll).toHaveBeenCalledWith('syncQueue');
      });
    }));
  });

  describe('method: deleteAllDeferredRequest', () => {
    it('should call clear method of dataBase', async(() => {
      inject([OnlineService], (service: OnlineService) => {
        service.isReady$.subscribe(() => {

          service.deleteAllDeferredRequest().then(() => {});
          expect(service.dataBase.clear).toHaveBeenCalledWith('syncQueue');
        });
      })();
    }));
  });
});
