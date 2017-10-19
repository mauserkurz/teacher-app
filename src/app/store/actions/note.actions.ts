import { type } from "../../helpers/type";
import { Action } from "@ngrx/store";
import { Note } from "../../core/models/note";

export const ActionTypes = {
    LOAD_NOTE: type('LOAD_NOTE'),
    ADD_NOTE: type('ADD_NOTE'),
    UPDATE_NOTE: type('UPDATE_NOTE'),
    REMOVE_NOTE: type('REMOVE_NOTE'),
    REMOVE_ALL_NOTE: type('REMOVE_ALL_NOTE'),
};

export class LoadNote implements Action {
    type = ActionTypes.LOAD_NOTE;
    payload: { notes: Note[] };

    constructor( notes: Note[] ) {
        this.payload = { notes };
    }
}

export class AddNote implements Action {
    type = ActionTypes.ADD_NOTE;
    payload: { note: Note };

    constructor( note: Note ) {
        this.payload = { note };
    }
}

export class UpdateNote implements Action {
    type = ActionTypes.UPDATE_NOTE;
    payload: { note: Note };

    constructor( note: Note ) {
        this.payload = { note };
    }
}

export class RemoveNote implements Action {
    type = ActionTypes.REMOVE_NOTE;
    payload: { noteId: string };

    constructor( noteId: string ) {
        this.payload = { noteId };
    }
}

export class RemoveAllNote implements Action {
    type = ActionTypes.REMOVE_ALL_NOTE;
    payload = { notes: [] };

    constructor() {}
}

export type Actions = LoadNote | AddNote | UpdateNote | RemoveNote | RemoveAllNote;