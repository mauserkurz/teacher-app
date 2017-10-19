import { Score } from "../../core/models/score";
import { scoreArr } from "../../helpers/data_for_tests";
import { LoadScore, RemoveAllScore, UpdateScore } from "../actions/score.actions";
import { scoreReducer } from "./score.reducer";

describe('Reducer: score', () => {
  let initialState: Score[];
  let changedState: Score[];

  beforeEach(() => {
    initialState = [...scoreArr];
  });

  describe('type LOAD_SCORE', () => {
    const fakeData: Score[] = [
        new Score({ id: 'testScore1' }),
        new Score({ id: 'testScore2' }),
        new Score({ id: 'testScore3' }),
      ];

    it('should load scores - replace state by received score array', () => {
      changedState = scoreReducer(
        initialState,
        new LoadScore(fakeData)
      );

      expect(changedState).not.toEqual(initialState);
      expect(changedState).toEqual(fakeData);
    });
  });

  describe('type UPDATE_SCORE', () => {
    it('should update score - state change one score with same id', () => {
      const updateScore: Score = new Score({ id: initialState[0].id });

      changedState = scoreReducer(
        initialState,
        new UpdateScore(updateScore)
      );

      expect(changedState).not.toEqual(initialState);
      expect(changedState.length).toEqual(initialState.length);
      expect(changedState.find(value => value.id === updateScore.id)).toEqual(updateScore);
    });
  });

  describe('type: REMOVE_ALL_SCORE', () => {
    it('should delete scores - remove all scores from state', () => {
      changedState = scoreReducer(
        initialState,
        new RemoveAllScore()
      );

      expect(changedState).not.toEqual(initialState);
      expect(changedState).toEqual([]);
    });
  });
});
