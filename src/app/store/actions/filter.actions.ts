import { type } from "../../helpers/type";
import { Action } from "@ngrx/store";

export interface IFilterJournal {
    groupId: string,
    matterId: string,
}
export const ActionTypes = {
    FILTER_JOURNAL: type('FILTER_JOURNAL'),
};

export class FilterJournal implements Action {
    type = ActionTypes.FILTER_JOURNAL;
    payload: IFilterJournal;

    constructor(data: IFilterJournal) {
      this.payload = data;
    }
}

export type Actions = FilterJournal;