import { User } from "../../auth/models/user";
import { user } from "../../helpers/data_for_tests";
import { DeleteUser, SaveUser } from "../actions/user.actions";
import { userReducer } from "./user.reducer";

describe('Reducer: user', () => {
  describe('type SAVE_USER', () => {
    const initialState: null = null;
    const fakeData: User = user;
    let changedState: User;

    it('should save user - replace state by fakeData user', () => {
      changedState = userReducer(
        initialState,
        new SaveUser(fakeData)
      );

      expect(changedState).not.toEqual(initialState);
      expect(changedState).toEqual(fakeData);
    });
  });

  describe('type DELETE_USER', () => {
    const initialState: User = user;
    let changedState: User;

    it('should delete user - replace state by null', () => {
      changedState = userReducer(
        initialState,
        new DeleteUser()
      );

      expect(changedState).not.toEqual(initialState);
      expect(changedState).toEqual(null);
    });
  });
});