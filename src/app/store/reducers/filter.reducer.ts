import * as filter from '../actions/filter.actions';
import { AppState } from "../state/app.state";
import { IFilterJournal } from "../actions/filter.actions";

export function filterReducer ( state: IFilterJournal = { groupId: '', matterId: '' }, action: filter.Actions ): any {
  switch (action.type) {

    case filter.ActionTypes.FILTER_JOURNAL: {
      return action.payload;
    }

    default:
      return state;
  }
}

export const getFilterState = (state: AppState) => state.filter;
