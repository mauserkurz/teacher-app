import { type } from "../../helpers/type";
import { Action } from "@ngrx/store";
import { Score } from "../../core/models/score";

export const ActionTypes = {
    LOAD_SCORE: type('LOAD_SCORE'),
    UPDATE_SCORE: type('UPDATE_SCORE'),
    REMOVE_ALL_SCORE: type('REMOVE_ALL_SCORE'),
};

export class LoadScore implements Action {
    type = ActionTypes.LOAD_SCORE;
    payload: { scores: Score[] };

    constructor(scores: Score[]) {
        this.payload = { scores };
    }
}

export class UpdateScore implements Action {
    type = ActionTypes.UPDATE_SCORE;
    payload: { score: Score };

    constructor(score: Score) {
        this.payload = { score };
    }
}

export class RemoveAllScore implements Action {
    type = ActionTypes.REMOVE_ALL_SCORE;
    payload = { scores: [] };

    constructor() {}
}

export type Actions = LoadScore | UpdateScore | RemoveAllScore;