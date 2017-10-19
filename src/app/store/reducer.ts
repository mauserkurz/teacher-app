// vendor
import { Action, ActionReducerMap } from "@ngrx/store";
// reducers
import { matterReducer } from "./reducers/matter.reducer";
import { groupReducer } from "./reducers/group.reducer";
import { lessonReducer } from "./reducers/lesson.reducer";
import { connectionReducer } from "./reducers/connection.reducer";
import { userReducer } from "./reducers/user.reducer";
import { studentReducer } from "./reducers/student.reducer";
import { scoreReducer } from "./reducers/score.reducer";
import { noteReducer } from "./reducers/note.reducer";
import { filterReducer } from "./reducers/filter.reducer";
// state
import { AppState } from "./state/app.state";
import { Group } from "../core/models/group";

export interface IFilterJournalData {
  groupId: any;
  studentIds: any[];
  matterId: any;
}

export const rootReducer: ActionReducerMap<AppState, Action> = {
  user: userReducer,
  connection: connectionReducer,
  matters: matterReducer,
  groups: groupReducer,
  lessons: lessonReducer,
  students: studentReducer,
  scores: scoreReducer,
  notes: noteReducer,
  filter: filterReducer,
};

export const getState = (state: AppState) => state;