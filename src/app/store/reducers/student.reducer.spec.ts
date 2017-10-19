import { Student } from "../../core/models/student";
import { studentArr } from "../../helpers/data_for_tests";
import { LoadStudent, RemoveAllStudent, UpdateStudent } from "../actions/student.actions";
import { studentReducer } from "./student.reducer";

describe('Reducer: students', () => {
  let initialState: Student[];
  let changedState: Student[];

  beforeEach(() => {
     initialState = [...studentArr];
  });

  describe('type LOAD_STUDENT', () => {
    const fakeData: Student[] = [
        new Student({ id: 'testStudent1' }),
        new Student({ id: 'testStudent2' }),
        new Student({ id: 'testStudent3' }),
      ];

    it('should load students - replace state by received student array', () => {
      changedState = studentReducer(
        initialState,
        new LoadStudent(fakeData)
      );

      expect(changedState).not.toEqual(initialState);
      expect(changedState).toEqual(fakeData);
    });
  });

  describe('type UPDATE_STUDENT', () => {
    it('should update student - state change one student with same id', () => {
      const updatedStudent: Student = new Student({ id: initialState[0].id });

      changedState = studentReducer(
        initialState,
        new UpdateStudent(updatedStudent)
      );

      expect(changedState).not.toEqual(initialState);
      expect(changedState.length).toEqual(initialState.length);
      expect(changedState.find(value => value.id === updatedStudent.id)).toEqual(updatedStudent);
    });
  });

  describe('type: REMOVE_ALL_STUDENT', () => {
    it('should delete students - remove all students from state', () => {
      changedState = studentReducer(
        initialState,
        new RemoveAllStudent()
      );

      expect(changedState).not.toEqual(initialState);
      expect(changedState).toEqual([]);
    });
  });
});