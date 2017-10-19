import { type } from "../../helpers/type";
import { Action } from "@ngrx/store";

export interface IConnectionPayload {
    isWait: boolean,
}

export const ActionTypes = {
    START_CONNECTION: type('START_CONNECTION'),
    COMPLETE_CONNECTION: type('COMPLETE_CONNECTION'),
};

export class StartConnection implements Action {
    type = ActionTypes.START_CONNECTION;
    payload = { isWait: true };

    constructor() {}
}

export class CompleteConnection implements Action {
    type = ActionTypes.COMPLETE_CONNECTION;
    payload = { isWait: false };

    constructor() {}
}

export type Actions = StartConnection | CompleteConnection;