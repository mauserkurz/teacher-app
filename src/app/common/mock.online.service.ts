import { Injectable } from "@angular/core";
import { RequestOptionsArgs } from "@angular/http";

@Injectable ()
export class MockOnlineService {
  online: boolean = true;
  deferredRequests: any[] = [];

  constructor () {}

  isOnline (): boolean {
    return this.online;
  }

  init (): void {}

  deleteAllDeferredRequest (): Promise<boolean> {
    return new Promise(() => true);
  }

  addDeferredRequest(isOnline: boolean, method: string, url: string, options?: RequestOptionsArgs): Promise<boolean> {
    if (isOnline) {
      return;
    }

    this.deferredRequests.push({ method, url, options });

    return new Promise(() => true);
  }

  addWithBodyDeferredRequest(isOnline: boolean, method: string, url: string, body: any, options?: RequestOptionsArgs): Promise<boolean> {
    if (isOnline) {
      return;
    }

    this.deferredRequests.push({ method, url, body, options });

    return new Promise(() => true);
  }
}