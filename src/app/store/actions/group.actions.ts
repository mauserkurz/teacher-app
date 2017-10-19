import {Action} from "@ngrx/store";
import { type } from "../../helpers/type";
import { Group } from "../../core/models/group";

export const ActionTypes = {
    LOAD_GROUP: type('LOAD_GROUP'),
    REMOVE_ALL_GROUP: type('REMOVE_ALL_GROUP'),
};

export class LoadGroup implements Action {
    type = ActionTypes.LOAD_GROUP;
    payload: { groups: Group[] };

    constructor( groups: Group[] ) {
        this.payload = { groups };
    }
}

export class RemoveAllGroup implements Action {
    type = ActionTypes.REMOVE_ALL_GROUP;
    payload = { groups: [] };

    constructor() {}
}

export type Actions = LoadGroup | RemoveAllGroup;