import { Student } from "../../core/models/student";
import * as student from '../actions/student.actions';
import { AppState } from "../state/app.state";

export function studentReducer (state: Student[] = [], action: student.Actions ): Student[] {
  switch (action.type) {

    case student.ActionTypes.LOAD_STUDENT: {
      return [...action.payload['students']];
    }

    case student.ActionTypes.UPDATE_STUDENT: {
      const changedState = [...state];

      changedState.splice(
        state.findIndex(student => student.id === action.payload['student'].id),
        1,
        action.payload['student']
      );

      return changedState;
    }

    case student.ActionTypes.REMOVE_ALL_STUDENT: {
      return action.payload['students'];
    }

    default:
      return state;
  }
}

export const getStudents = (state: AppState) => state.students;