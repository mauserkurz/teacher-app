import { Group } from "../../core/models/group";
import { groupArr } from "../../helpers/data_for_tests";
import { groupReducer } from "./group.reducer";
import { RemoveAllGroup, LoadGroup } from "../actions/group.actions";

describe('Reducer: groups', () => {
  let initialState: Group[];
  let changedState: Group[];

  beforeEach(() => {
    initialState = [...groupArr];
  });

  describe('type LOAD_GROUP', () => {
    const fakeData: Group[] = [
        new Group({ id: 'testGroup1' }),
        new Group({ id: 'testGroup2' }),
        new Group({ id: 'testGroup3' }),
      ];

    it('should load groups - replace state by received group array', () => {
      changedState = groupReducer(
        initialState,
        new LoadGroup(fakeData)
      );

      expect(changedState).not.toEqual(initialState);
      expect(changedState).toEqual(fakeData);
    });
  });

  describe('type: REMOVE_ALL_GROUP', () => {
    it('should delete groups - remove all groups from state', () => {
      changedState = groupReducer(
        initialState,
        new RemoveAllGroup()
      );

      expect(changedState).not.toEqual(initialState);
      expect(changedState).toEqual([]);
    });
  });
});
