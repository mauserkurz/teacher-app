import { type } from "../../helpers/type";
import { Action } from "@ngrx/store";
import { User } from "../../auth/models/user";

export const ActionTypes = {
    SAVE_USER: type('SAVE_USER'),
    DELETE_USER: type('DELETE_USER'),
};

export class SaveUser implements Action {
    type = ActionTypes.SAVE_USER;
    payload: { user: User };

    constructor( user: User ) {
        this.payload = { user };
    }
}

export class DeleteUser implements Action {
    type = ActionTypes.DELETE_USER;
    payload = { user: null };

    constructor () {}
}

export type Actions = SaveUser | DeleteUser;