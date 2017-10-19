import { type } from "../../helpers/type";
import { Action } from "@ngrx/store";
import { Student } from "../../core/models/student";

export const ActionTypes = {
  LOAD_STUDENT: type ('LOAD_STUDENT'),
  UPDATE_STUDENT: type ('UPDATE_STUDENT'),
  REMOVE_ALL_STUDENT: type ('REMOVE_ALL_STUDENT'),
};

export class LoadStudent implements Action {
  type = ActionTypes.LOAD_STUDENT;
  payload: { students: Student[] };

  constructor (students: Student[]) {
    this.payload = { students };
  }
}

export class UpdateStudent implements Action {
  type = ActionTypes.UPDATE_STUDENT;
  payload: { student: Student };

  constructor (student: Student) {
    this.payload = { student };
  }
}

export class RemoveAllStudent implements Action {
  type = ActionTypes.REMOVE_ALL_STUDENT;
  payload = { students: [] };

  constructor () {}
}

export type Actions = LoadStudent | UpdateStudent | RemoveAllStudent;