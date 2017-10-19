// angular
import { Injectable } from '@angular/core';
import {
  RequestOptions,
  ConnectionBackend,
  Http,
  RequestOptionsArgs,
  Response
} from "@angular/http";
// vendor
import { Store } from "@ngrx/store";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/finally";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
// state
import { AppState } from "../store/state/app.state";

import { CompleteConnection, StartConnection } from "../store/actions/connection.actions";

@Injectable()
export class HttpWrapperService extends Http {
  requests: number = 0;

  constructor(
    backend: ConnectionBackend,
    initOptions: RequestOptions,
    private store: Store<AppState>
  ) {
    super(backend, initOptions);
  }

  private _startRequest () {
    if (this.requests === 0) {
      this.store.dispatch(new StartConnection);
    }

    this.requests++;
  }

  private _completeRequest () {
    this.requests--;

    if (this.requests === 0) {
      this.store.dispatch(new CompleteConnection);
    }
  }

  private _requestErrorHandler (error: any) {
    return Observable.throw (error);
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    this._startRequest();

    return super.get(url, options)
      .catch(error => this._requestErrorHandler(error))
      .finally(() => {
        this._completeRequest();
      });
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    this._startRequest();

    return super.post(url, body, options)
      .catch(error => this._requestErrorHandler(error))
      .finally(() => {
        this._completeRequest();
      });
  }

  put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    this._startRequest();

    return super.put(url, body, options)
      .catch(error => this._requestErrorHandler(error))
      .finally(() => {
        this._completeRequest();
      });
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    this._startRequest();

    return super.delete(url, options)
      .catch(error => this._requestErrorHandler(error))
      .finally(() => {
        this._completeRequest();
      });
  }
}

export function httpFactory (
  backend: ConnectionBackend,
  initOptions: RequestOptions,
  store: Store<AppState>
) {
  return new HttpWrapperService(backend, initOptions, store);
}