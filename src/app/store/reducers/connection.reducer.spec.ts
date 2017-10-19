import { CompleteConnection, IConnectionPayload, StartConnection } from "../actions/connection.actions";
import { connectionReducer } from "./connection.reducer";

describe('Reducer: connection', () => {
  describe('type START_CONNECTION', () => {
    const initialState: IConnectionPayload = { isWait: false };
    const finalState: IConnectionPayload = { isWait: true };
    let changedState: IConnectionPayload;

    it('should represent starting connection - replace state by received object', () => {
      changedState = connectionReducer(
        initialState,
        new StartConnection()
      );

      expect(changedState).not.toEqual(initialState);
      expect(changedState).toEqual(finalState);
    });
  });

  describe('type COMPLETE_CONNECTION', () => {
    const initialState: IConnectionPayload = { isWait: true };
    const finalState: IConnectionPayload = { isWait: false };
    let changedState: IConnectionPayload;

    it('should represent end connection - replace state by received object', () => {
      changedState = connectionReducer(
        initialState,
        new CompleteConnection()
      );

      expect(changedState).not.toEqual(initialState);
      expect(changedState).toEqual(finalState);
    });
  });
});