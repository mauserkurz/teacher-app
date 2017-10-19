import { Group } from "../../core/models/group";
import * as group from '../actions/group.actions';
import { AppState } from "../state/app.state";

export function groupReducer ( state: Group[] = [], action: group.Actions ): Group[] {
  switch (action.type) {

    case group.ActionTypes.LOAD_GROUP: {
      return [...action.payload.groups];
    }

    case group.ActionTypes.REMOVE_ALL_GROUP: {
      return action.payload.groups;
    }

    default:
      return state;
  }
}

export const getGroups = (state: AppState) => state.groups;
