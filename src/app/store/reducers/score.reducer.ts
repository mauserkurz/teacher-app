import { Score } from "../../core/models/score";
import * as score from "../actions/score.actions";
import { AppState } from "../state/app.state";

export function scoreReducer (state: Score[] = [], action: score.Actions ): Score[] {
  switch (action.type) {

    case score.ActionTypes.LOAD_SCORE: {
      return [...action.payload['scores']];
    }

    case score.ActionTypes.UPDATE_SCORE: {
      const changedState = [...state];

      changedState
        .splice(
          state.findIndex(score => score.id === action.payload['score'].id),
          1,
          action.payload['score']
        );

      return changedState;
    }

    case score.ActionTypes.REMOVE_ALL_SCORE: {
      return action.payload['scores'];
    }

    default:
      return state;
  }
}

export const getScores = (state: AppState) => state.scores;