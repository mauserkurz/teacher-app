import { Lesson } from "../../core/models/lesson";
import * as lesson from '../actions/lesson.actions';
import { AppState } from "../state/app.state";

export function lessonReducer ( state: Lesson[] = [], action: lesson.Actions ): Lesson[] {
  switch (action.type) {

    case lesson.ActionTypes.LOAD_LESSON: {
      return [...action.payload['lessons']];
    }

    case lesson.ActionTypes.ADD_LESSON: {
      return [...state, action.payload['lesson']];
    }

    case lesson.ActionTypes.UPDATE_LESSON: {
      const changedState = [...state];

      changedState.splice(
        state.findIndex(lesson => lesson.id === action.payload['lesson'].id),
        1,
        action.payload['lesson']
      );

      return changedState;
    }

    case lesson.ActionTypes.REMOVE_LESSON: {
      return [...state].filter(lesson => lesson.id !== action.payload['lessonId']);
    }

    case lesson.ActionTypes.REMOVE_ALL_LESSON: {
      return action.payload['lessons'];
    }

    default:
      return state;
  }
}

export const getLessons = (state: AppState) => state.lessons;
