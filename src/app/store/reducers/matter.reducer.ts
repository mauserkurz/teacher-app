import { Matter } from "../../core/models/matter";
import * as matter from '../actions/matter.actions';
import { AppState } from "../state/app.state";

export function matterReducer ( state: Matter[] = [], action: matter.Actions ): Matter[] {
  switch (action.type) {

    case matter.ActionTypes.LOAD_MATTER: {
      return [...action.payload.matters];
    }

    case matter.ActionTypes.REMOVE_ALL_MATTER: {
      return action.payload.matters;
    }

    default:
      return state;
  }
}

export const getMatters = (state: AppState) => state.matters;
