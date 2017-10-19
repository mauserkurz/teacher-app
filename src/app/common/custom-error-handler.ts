import { ErrorHandler, Injectable } from "@angular/core";
import { API_URL } from "../configuration";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
  errors$: BehaviorSubject<IErrorData> = new BehaviorSubject(null);
  startTime: number = new Date().getTime();

  constructor () {}

  handleError (error: any): void {
    const user: string = window.localStorage['currentUser'] || 'not authorized';
    const clientError: string = error.toString();
    const timeAfterStart: number = +new Date() - this.startTime;
    const stackTrace: string = error.stack || 'no stack trace';
    const userAgent: string = navigator.userAgent;
    const errorData: IErrorData = { clientError, user, stackTrace, timeAfterStart, userAgent };

    this.errors$.next(errorData);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}/errors`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(errorData));

    throw error;
  }
}

export interface IErrorData {
  clientError: any;
  user: string;
  stackTrace: string;
  timeAfterStart: number;
  userAgent: string;
}