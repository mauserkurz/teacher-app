import { AppState } from "../state/app.state";
import { User } from "../../auth/models/user";
import * as user from "../actions/user.actions";

export function userReducer (state: User | null = null, action: user.Actions ): User | null {
  switch (action.type) {

    case user.ActionTypes.SAVE_USER: {
      return Object.assign(new User({}), action.payload.user);
    }

    case user.ActionTypes.DELETE_USER: {
      return action.payload.user;
    }

    default:
      return state;
  }
}

export const getUser = (state: AppState) => state.user;
