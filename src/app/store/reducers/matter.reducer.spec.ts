import { Matter } from "../../core/models/matter";
import { matterArr } from "../../helpers/data_for_tests";
import { LoadMatter, RemoveAllMatter } from "../actions/matter.actions";
import { matterReducer } from "./matter.reducer";

describe('Reducer: matters', () => {
  let initialState: Matter[];
  let changedState: Matter[];

  beforeEach(() => {
     initialState = [...matterArr];
  });

  describe('type LOAD_MATTER', () => {
    const fakeData: Matter[] = [
        new Matter({ id: 'testMatter1' }),
        new Matter({ id: 'testMatter2' }),
        new Matter({ id: 'testMatter3' }),
      ];

    it('should load matters - replace state by received matter array', () => {
      changedState = matterReducer(
        initialState,
        new LoadMatter(fakeData)
      );

      expect(changedState).not.toEqual(initialState);
      expect(changedState).toEqual(fakeData);
    });
  });

  describe('type: REMOVE_ALL_MATTER', () => {
    it('should delete matters - remove all matters from state', () => {
      changedState = matterReducer(
        initialState,
        new RemoveAllMatter()
      );

      expect(changedState).not.toEqual(initialState);
      expect(changedState).toEqual([]);
    });
  });
});
