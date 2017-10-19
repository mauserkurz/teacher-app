import { Note } from "../../core/models/note";
import * as note from "../actions/note.actions";
import { AppState } from "../state/app.state";

export function noteReducer (state: Note[] = [], action: note.Actions ): Note[] {
  switch (action.type) {

    case note.ActionTypes.LOAD_NOTE: {
      return [...action.payload['notes']];
    }

    case note.ActionTypes.ADD_NOTE: {
      return [...state, action.payload['note']];
    }

    case note.ActionTypes.UPDATE_NOTE: {
      const changedState = [...state];

      return changedState
        .filter(note => note.id !== action.payload['note'].id)
        .concat(action.payload['note']);
    }

    case note.ActionTypes.REMOVE_NOTE: {
      return [...state].filter(note => action.payload['noteId'] !== note.id);
    }

    case note.ActionTypes.REMOVE_ALL_NOTE: {
      return action.payload['notes'];
    }

    default:
      return state;
  }
}

export const getNotes = (state: AppState) => state.notes;