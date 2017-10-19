import * as connection from "../actions/connection.actions";
import { AppState } from "../state/app.state";
import { IConnectionPayload } from "../actions/connection.actions";

export function connectionReducer (
  state: IConnectionPayload = { isWait: false },
  action: connection.Actions
): IConnectionPayload {
  switch (action.type) {

    case connection.ActionTypes.START_CONNECTION: {
      return Object.assign({}, action.payload);
    }

    case connection.ActionTypes.COMPLETE_CONNECTION: {
      return Object.assign({}, action.payload);
    }

    default:
      return state;
  }
}

export const getConnection = (state: AppState) => state.connection;