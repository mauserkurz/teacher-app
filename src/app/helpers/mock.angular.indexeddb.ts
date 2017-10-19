//import { Store } from "@ngrx/store";
//import { AppState } from "../store/state/app.state";
//import { Http } from "@angular/http";
//import { OnlineService } from "../common/online.service";
//import { DB_SETTINGS, TABLE_SETTINGS } from "../configuration";
//import { AngularIndexedDB } from "angular2-indexeddb";
//
//export class MockAngularIndexedDB implements AngularIndexedDB {
//  private utils: Utils;
//  private dbWrapper: DbWrapper;
//  settings: any = {};
//  data: any = {};
//
//  constructor(name, version) {
//    this.settings = { name, version };
//  }
//
//  update(objectStore: string, data: any, dbVesion: number, key?: any): Promise<any> {
//    this.data[objectStore] = data;
//
//    return new Promise(() => true);
//  }
//
//  add(objectStore: string, data: any): Promise<any> {
//    this.data[objectStore] = data;
//
//    return new Promise(() => true);
//  }
//
//  getAll(objectStore: string): Promise<any> {
//    return new Promise(() => this.data[objectStore]);
//  }
//
//  clear(objectStore: string): Promise<any> {
//    delete this.data[objectStore];
//
//    return new Promise(() => true);
//  }
//
//  getByKey(objectStore: string, key: any): Promise<any> {
//    return new Promise(() => this.data[objectStore][key]);
//  }
//
//  delete(objectStore: string, key: any) {
//    delete this.data[objectStore][key];
//
//    return new Promise(() => true);
//  }
//
//  createStore(storeVersion: number, functor: any) {
//    const event: any = {};
//
//    functor(event);
//  }
//
//  getByIndex() {}
//
//  openCursor() {}
//}
//
//class Utils {
//    indexedDB: IDBFactory;
//
//    constructor() {
//        this.indexedDB = window.indexedDB || (<any>window).mozIndexedDB || (<any>window).webkitIndexedDB || (<any>window).msIndexedDB;
//    }
//}
//
//class DbWrapper {
//    dbName: string;
//    dbVersion: number;
//    db: IDBDatabase;
//
//    constructor(dbName: string, version: number) {
//        this.dbName = dbName;
//        this.dbVersion = version || 1;
//        this.db = null;
//    }
//
//    validateStoreName(storeName: string) {
//        return this.db.objectStoreNames.contains(storeName);
//    };
//
//    validateBeforeTransaction(storeName: string, reject: Function) {
//        if (!this.db) {
//            reject('You need to use the createStore function to create a database before you query it!');
//        }
//        if (!this.validateStoreName(storeName)) {
//            reject(('objectStore does not exists: ' + storeName));
//        }
//    }
//
//    createTransaction(options: { storeName: string, dbMode: IDBTransactionMode, error: (e: Event) => any, complete: (e: Event) => any, abort?: (e:Event) => any }): IDBTransaction {
//        let trans: IDBTransaction = this.db.transaction(options.storeName, options.dbMode);
//        trans.onerror = options.error;
//        trans.oncomplete = options.complete;
//        trans.onabort = options.abort;
//        return trans;
//    }
//}
//
//export function fakeOnlineServiceFactory (store: Store<AppState>, http: Http): OnlineService {
//  return new OnlineService(store, http, new MockAngularIndexedDB(DB_SETTINGS.name, DB_SETTINGS.version), DB_SETTINGS, TABLE_SETTINGS);
//}