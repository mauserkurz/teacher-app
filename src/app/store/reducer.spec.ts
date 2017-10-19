// angular
import { inject, TestBed } from "@angular/core/testing";
// vendor
import { Store, StoreModule } from "@ngrx/store";
// actions
import { LoadGroup } from "./actions/group.actions";
import { LoadMatter } from "./actions/matter.actions";
import { LoadLesson } from "./actions/lesson.actions";
import { SaveUser } from "./actions/user.actions";
import { IConnectionPayload, StartConnection } from "./actions/connection.actions";
import { LoadStudent } from "./actions/student.actions";
import { LoadScore } from "./actions/score.actions";
import { LoadNote } from "./actions/note.actions";
import { FilterJournal } from "./actions/filter.actions";
// reducers
import { getGroups } from "./reducers/group.reducer";
import { getMatters } from "./reducers/matter.reducer";
import { getLessons } from "./reducers/lesson.reducer";
import { getUser } from "./reducers/user.reducer";
import { getConnection } from "./reducers/connection.reducer";
import { getStudents } from "./reducers/student.reducer";
import { getScores } from "./reducers/score.reducer";
import { getNotes } from "./reducers/note.reducer";
import { getFilterState } from "./reducers/filter.reducer";
import { rootReducer } from "./reducer";
// state
import { AppState } from "./state/app.state";
// models
import { Group } from "../core/models/group";
import { Matter } from "../core/models/matter";
import { Lesson } from "../core/models/lesson";
import { User } from "../auth/models/user";
import { Student } from "../core/models/student";
import { Score } from "../core/models/score";
import { Note } from "../core/models/note";
// testing data
import {
  filterData,
  groupArr,
  lessonArr,
  matterArr,
  noteArr,
  scoreArr,
  studentArr,
  user
} from "../helpers/data_for_tests";

describe('Reducer: Root', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(rootReducer),
      ],
    });
  });

  it('should create store', inject([Store], (store: Store<AppState>) => {
    expect(store.select(state => state)).toBeTruthy();
  }));

  it('should have matter branch - store react on load matters action and show data by means of selector', inject([Store], (store: Store<AppState>) => {
    const matters$: Store<Matter[]> = store.select(getMatters);
    let data: Matter[];

    matters$.subscribe(value => data = value);

    store.dispatch(new LoadMatter(matterArr));
    expect(data).toEqual(matterArr);
  }));

  it('should have group branch - store react on load groups action and show data by means of selector', inject([Store], (store: Store<AppState>) => {
    const groups$: Store<Group[]> = store.select(getGroups);
    let data: Group[];

    groups$.subscribe(value => data = value);

    store.dispatch(new LoadGroup(groupArr));
    expect(data).toEqual(groupArr);
  }));

  it('should have lesson branch - store react on load lessons action and show data by means of selector', inject([Store], (store: Store<AppState>) => {
    const lessons$: Store<Lesson[]> = store.select(getLessons);
    let data: Lesson[];

    lessons$.subscribe(value => data = value);

    store.dispatch(new LoadLesson(lessonArr));
    expect(data).toEqual(lessonArr);
  }));

  it('should have user branch - store react on saving user and show data by means of selector', inject([Store], (store: Store<AppState>) => {
    const user$: Store<User> = store.select(getUser);
    let data: User;

    user$.subscribe(value => data = value);

    store.dispatch(new SaveUser(user));
    expect(data).toEqual(user);
  }));

  it('should have connection branch - store react on toggle connection and show data by means of selector', inject([Store], (store: Store<AppState>) => {
    const isWait$: Store<IConnectionPayload> = store.select(getConnection);
    let data: IConnectionPayload;

    isWait$.subscribe(value => data = value);

    store.dispatch(new StartConnection());
    expect(data).toEqual({ isWait: true });
  }));

  it('should have student branch - store react on load students and show data by means of selector', inject([Store], (store: Store<AppState>) => {
    const students$: Store<Student[]> = store.select(getStudents);
    let data: Student[];

    students$.subscribe(value => data = value);

    store.dispatch(new LoadStudent(studentArr));
    expect(data).toEqual(studentArr);
  }));

  it('should have score branch - store react on load score action and show data by means of selector', inject([Store], (store: Store<AppState>) => {
    const scores$: Store<Score[]> = store.select(getScores);
    let data: Score[];

    scores$.subscribe(value => data = value);

    store.dispatch(new LoadScore(scoreArr));
    expect(data).toEqual(scoreArr);
  }));

  it('should have note branch - store react on load note action and show data by means of selector', inject([Store], (store: Store<AppState>) => {
    const notes$: Store<Note[]> = store.select(getNotes);
    let data: Note[];

    notes$.subscribe(value => data = value);

    store.dispatch(new LoadNote(noteArr));
    expect(data).toEqual(noteArr);
  }));

  it('should have filter branch - store react on load filter action and show data by means of selector', inject([Store], (store: Store<AppState>) => {
    const filter$: Store<any> = store.select(getFilterState);
    let data: any;

    filter$.subscribe(value => data = value);

    store.dispatch(new FilterJournal(filterData));
    expect(data).toEqual(filterData);
  }));
});
