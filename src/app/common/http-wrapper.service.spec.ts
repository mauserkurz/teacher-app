// angular
import {
  Http,
  XHRBackend,
  RequestOptions,
  HttpModule,
  ResponseOptions,
  ResponseType,
  Response
} from "@angular/http";
import { TestBed, inject } from '@angular/core/testing';
import { MockBackend } from "@angular/http/testing";
// vendor
import { Store } from "@ngrx/store";
// service
import { httpFactory, HttpWrapperService } from './http-wrapper.service';
// mocks
import { MockStore } from "../store/mock.store"
// models
import { Lesson } from "../core/models/lesson";
import { Matter } from "../core/models/matter";
// testing data
import { lessonArr, matterArr, user } from "../helpers/data_for_tests";

class MockError extends Response implements Error {
    name: any;
    message: any;
}

describe('HttpWrapperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
      ],
      providers: [
        {
           provide: Store,
           useClass: MockStore,
        },
        {
          provide: XHRBackend,
          useClass: MockBackend
        },
        {
          provide: Http,
          useFactory: httpFactory,
          deps: [ XHRBackend, RequestOptions, Store ],
        },
      ]
    });
  });

  it('should be created', inject([Http], (service: HttpWrapperService) => {
    expect(service).toBeTruthy();
  }));

  describe('method: get', () => {
    it('should get user', inject([Http, XHRBackend], (service: HttpWrapperService, back: MockBackend) => {
      const mockResponse = [Object.assign({}, user)];
      const url: string = 'localhost:3000/user';
      let receivedData: Response;

      back.connections.subscribe(connection => {
        expect(connection.request.url).toEqual(url);

        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse),
        })));
      });

      service.get(url).subscribe((value: Response) => receivedData = value);
      expect(receivedData.json()).toEqual(mockResponse);
    }));

    it('should handle error',  inject([Http, XHRBackend], (service: HttpWrapperService, back: MockBackend) => {
        const url: string = 'localhost:3000/lessons/1';
        const body: string = JSON.stringify({ val: '' });
        let receivedData: Response;

        back.connections.subscribe(connection => {
          connection.mockError(new MockError(new ResponseOptions({
            type: ResponseType.Error,
            status: 404,
            body,
          })));
        });

        service.get(url).subscribe(() => {}, (value: Response) => receivedData = value);
        expect(receivedData.json()).toEqual(JSON.parse(body));
    }));
  });

  describe('method: post', () => {
    it('should post one lesson', inject([Http, XHRBackend], (service: HttpWrapperService, back: MockBackend) => {
      const mockResponse = [
        Object.assign(
          {},
          JSON.parse(JSON.stringify(lessonArr[0]))
        )
      ];
      const url: string = 'localhost:3000/lessons';
      const lesson: Lesson = lessonArr[0];
      let receivedData: Response;

      back.connections.subscribe(connection => {
        expect(connection.request.url).toEqual(url);

        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse),
        })));
      });

      service.post(url, lesson).subscribe((value: Response) => receivedData = value);
      expect(receivedData.json()).toEqual(mockResponse);
    }));

    it('should handle error',  inject([Http, XHRBackend], (service: HttpWrapperService, back: MockBackend) => {
        const url: string = 'localhost:3000/lessons';
        const lesson: Lesson = lessonArr[0];
        const body: string = JSON.stringify({ val: '' });
        let receivedData: Response;

        back.connections.subscribe(connection => {
          connection.mockError(new MockError(new ResponseOptions({
            type: ResponseType.Error,
            status: 404,
            body,
          })));
        });

        service.post(url, lesson).subscribe(() => {}, (value: Response) => receivedData = value);
        expect(receivedData.json()).toEqual(JSON.parse(body));
    }));
  });

  describe('method: put', () => {
    it('should update one matter', inject([Http, XHRBackend], (service: HttpWrapperService, back: MockBackend) => {
      const mockResponse = [
        Object.assign(
          {},
          JSON.parse(JSON.stringify(matterArr[0]))
        )
      ];
      const url: string = 'localhost:3000/matters/1';
      const matter: Matter = matterArr[0];
      let receivedData: Response;

      back.connections.subscribe(connection => {
        expect(connection.request.url).toEqual(url);

        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse),
        })));
      });

      service.put(url, matter).subscribe((value: Response) => receivedData = value);
      expect(receivedData.json()).toEqual(mockResponse);
    }));

    it('should handle error',  inject([Http, XHRBackend], (service: HttpWrapperService, back: MockBackend) => {
        const url: string = 'localhost:3000/lessons';
        const lesson: Lesson = lessonArr[0];
        const body: string = JSON.stringify({ val: '' });
        let receivedData: Response;

        back.connections.subscribe(connection => {
          connection.mockError(new MockError(new ResponseOptions({
            type: ResponseType.Error,
            status: 404,
            body,
          })));
        });

        service.put(url, lesson).subscribe(() => {}, (value: Response) => receivedData = value);
        expect(receivedData.json()).toEqual(JSON.parse(body));
    }));
  });

  describe('method: delete', () => {
    it('should delete one matter', inject([Http, XHRBackend], (service: HttpWrapperService, back: MockBackend) => {
      const mockResponse = [
        Object.assign(
          {},
          JSON.parse(JSON.stringify(matterArr[0]))
        )
      ];
      const url: string = 'localhost:3000/matters/1';
      let receivedData: Response;

      back.connections.subscribe(connection => {
        expect(connection.request.url).toEqual(url);

        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse),
        })));
      });

      service.delete(url).subscribe((value: Response) => receivedData = value);
      expect(receivedData.json()).toEqual(mockResponse);
    }));

    it('should handle error',  inject([Http, XHRBackend], (service: HttpWrapperService, back: MockBackend) => {
        const url: string = 'localhost:3000/lessons/1';
        const body: string = JSON.stringify({ val: '' });
        let receivedData: Response;

        back.connections.subscribe(connection => {
          connection.mockError(new MockError(new ResponseOptions({
            type: ResponseType.Error,
            status: 404,
            body,
          })));
        });

        service.delete(url).subscribe(() => {}, (value: Response) => receivedData = value);
        expect(receivedData.json()).toEqual(JSON.parse(body));
    }));
  });
});
