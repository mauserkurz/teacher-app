import { filterData } from "../../helpers/data_for_tests";
import { FilterJournal } from "../actions/filter.actions";
import { filterReducer } from "./filter.reducer";

describe('Reducer: filter', () => {
  let initialState: any;
  let changedState: any;

  beforeEach(() => {
    initialState = null;
  });

  describe('type FILTER_JOURNAL', () => {
    const fakeData: any = filterData;

    it('should set filter - replace state by received data', () => {
      changedState = filterReducer(
        initialState,
        new FilterJournal(fakeData)
      );

      expect(changedState).not.toEqual(initialState);
      expect(changedState).toEqual(fakeData);
    });
  });
});