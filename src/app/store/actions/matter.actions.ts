import {Action} from "@ngrx/store";
import { type } from "../../helpers/type";
import { Matter } from "../../core/models/matter";

export const ActionTypes = {
    LOAD_MATTER: type('LOAD_MATTER'),
    REMOVE_ALL_MATTER: type('REMOVE_ALL_MATTER'),
};

export class LoadMatter implements Action {
    type = ActionTypes.LOAD_MATTER;
    payload: { matters: Matter[] };

    constructor(matters: Matter[]) {
        this.payload = { matters };
    }
}

export class RemoveAllMatter implements Action {
    type = ActionTypes.REMOVE_ALL_MATTER;
    payload = { matters: [] };

    constructor() {}
}

export type Actions = LoadMatter | RemoveAllMatter;