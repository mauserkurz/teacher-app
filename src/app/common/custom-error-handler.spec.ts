import { inject, TestBed } from "@angular/core/testing";
import { CustomErrorHandler } from "./custom-error-handler";
import { ErrorHandler } from "@angular/core";

describe('CustomErrorHandler', () => {
  const error: any = new Error('test error');

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ErrorHandler, useClass: CustomErrorHandler }
      ]
    });
  });

  it('should be created', inject([ErrorHandler], (handler: CustomErrorHandler) => {
    expect(handler).toBeTruthy();
    expect(handler.errors$.getValue()).toBeNull();
  }));

  describe('method: handleError', () => {
    it('should throw received error', inject([ErrorHandler], (handler: CustomErrorHandler) => {
      expect(_ => handler.handleError(error)).toThrowError(error.message);
    }));

    it('should emit custom object with error data', inject([ErrorHandler], (handler: CustomErrorHandler) => {
      try {
        handler.handleError(error)
      } catch (error) {}

      expect(handler.errors$.getValue().clientError).toEqual(error.toString());
    }));

    it('should try send XHR request to server', inject([ErrorHandler], (handler: CustomErrorHandler) => {
      spyOn<any>(XMLHttpRequest.prototype, 'open').and.callThrough();
      spyOn<any>(XMLHttpRequest.prototype, 'send');

      try {
        handler.handleError(error)
      } catch (error) {}

      expect(XMLHttpRequest.prototype.open).toHaveBeenCalled();
      expect(XMLHttpRequest.prototype.send).toHaveBeenCalled();
    }));
  });
});