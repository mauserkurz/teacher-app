import { Lesson } from "../../core/models/lesson";
import { lessonArr } from "../../helpers/data_for_tests";
import { lessonReducer } from "./lesson.reducer";
import { AddLesson, LoadLesson, RemoveAllLesson, RemoveLesson, UpdateLesson } from "../actions/lesson.actions";

describe('Reducer: lessons', () => {
  let initialState: Lesson[];
  let changedState: Lesson[];

  beforeEach(() => {
    initialState = [...lessonArr];
  });

  describe('type LOAD_LESSON', () => {
    const fakeData: Lesson[] = [
        new Lesson({ id: 'testLesson1' }),
        new Lesson({ id: 'testLesson2' }),
        new Lesson({ id: 'testLesson3' }),
      ];

    it('should load lessons - replace state by received lesson array', () => {
      changedState = lessonReducer(
        initialState,
        new LoadLesson(fakeData)
      );

      expect(changedState).not.toEqual(initialState);
      expect(changedState).toEqual(fakeData);
    });
  });

  describe('type ADD_LESSON', () => {
    it('should add lesson - state take an other one lesson', () => {
      const lesson: Lesson = new Lesson({ id: 'testLesson1' });

      changedState = lessonReducer(
        initialState,
        new AddLesson(lesson)
      );

      expect(changedState).not.toEqual(initialState);
      expect(changedState).toEqual(initialState.concat(lesson));
    });
  });

  describe('type UPDATE_LESSON', () => {
    it('should update lesson - state change one lesson with same id', () => {
      const updatedLesson: Lesson = new Lesson({ id: initialState[0].id });

      changedState = lessonReducer(
        initialState,
        new UpdateLesson(updatedLesson)
      );

      expect(changedState).not.toEqual(initialState);
      expect(changedState.length).toEqual(initialState.length);
      expect(changedState.find(value => value.id === updatedLesson.id)).toEqual(updatedLesson);
    });
  });

  describe('type REMOVE_LESSON', () => {
    it('should remove lesson - state lost one lesson', () => {
      const removeLessonId: string = lessonArr[0].id;

      changedState = lessonReducer(
        initialState,
        new RemoveLesson(removeLessonId)
      );

      expect(changedState).not.toEqual(initialState);
      expect(changedState.length).toEqual(initialState.length - 1);
      expect(changedState.findIndex(lesson => lesson.id === removeLessonId)).toEqual(-1);
    });
  });

  describe('type: REMOVE_ALL_LESSON', () => {
    it('should delete lessons - remove all lessons from state', () => {
      changedState = lessonReducer(
        initialState,
        new RemoveAllLesson()
      );

      expect(changedState).not.toEqual(initialState);
      expect(changedState).toEqual([]);
    });
  });
});
