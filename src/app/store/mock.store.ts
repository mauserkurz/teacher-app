// vendor
import { Action } from "@ngrx/store";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Subject } from "rxjs/Subject";
import 'rxjs/add/observable/of';
import { map } from "rxjs/operator/map";
// state
import { AppState } from "./state/app.state";
// testing data
import {
  groupArr,
  lessonArr,
  matterArr,
  noteArr,
  scoreArr,
  studentArr
} from "../helpers/data_for_tests";

export class MockStore {
  fakeState: AppState = {
    user: null,
    connection: { isWait: false },
    matters: [...matterArr],
    groups: [...groupArr],
    lessons: [...lessonArr],
    students: [...studentArr],
    scores: [...scoreArr],
    notes: [...noteArr],
    filter: null,
  };

  actions$: Subject<Action> = new BehaviorSubject<Action>(null);
  fakeData$: Subject<AppState> = new BehaviorSubject<AppState>(this.fakeState);

  public dispatch(action: Action): void {
    this.actions$.next(action);
  }

  public select(selector: any): Observable<any> {
    return map.call(this.fakeData$, selector);
  }
}