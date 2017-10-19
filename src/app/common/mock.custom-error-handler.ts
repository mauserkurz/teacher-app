import { ErrorHandler, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { IErrorData } from "./custom-error-handler";

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
  errors$: BehaviorSubject<IErrorData> = new BehaviorSubject(null);
  startTime: number = new Date().getTime();

  constructor() {}

  handleError (error: any): void {
    const user: string = 'not authorized';
    const clientError: string = error.toString();
    const timeAfterStart: number = +new Date() - this.startTime;
    const stackTrace: string = 'no stack trace';
    const userAgent: string = navigator.userAgent;
    const errorData: IErrorData = { clientError, user, stackTrace, timeAfterStart, userAgent };

    this.errors$.next(errorData);

    throw error;
  }
}