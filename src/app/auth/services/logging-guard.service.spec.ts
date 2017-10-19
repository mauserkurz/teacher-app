// angular
import { TestBed, inject } from '@angular/core/testing';
// vendor
import { Store } from "@ngrx/store";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/of';
// service
import { LoggingGuardService } from './logging-guard.service';
// mock
import { MockStore } from "../../store/mock.store";
// testing data
import { user } from "../../helpers/data_for_tests";

describe('LoggingGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoggingGuardService,
        { provide: Store, useClass: MockStore },
      ]
    });
  });

  it('should be created', inject([LoggingGuardService], (service: LoggingGuardService) => {
    expect(service).toBeTruthy();
  }));

  describe('method: canActivate', () => {
    let isActive: boolean;

    it('should return true when store has user', (done) => {
      inject([LoggingGuardService, Store], (service: LoggingGuardService, store: MockStore) => {
        spyOn<MockStore>(store, 'select').and.returnValue(Observable.of(user));

        service.canActivate().subscribe(value => {
          isActive = value;
          expect(isActive).toBeTruthy();
          done();
        });
      })();
    });
  });
});
