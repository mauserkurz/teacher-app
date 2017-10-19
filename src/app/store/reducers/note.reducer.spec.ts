import { Note } from "../../core/models/note";
import { noteArr } from "../../helpers/data_for_tests";
import { AddNote, LoadNote, RemoveAllNote, RemoveNote, UpdateNote } from "../actions/note.actions";
import { noteReducer } from "./note.reducer";

describe('Reducer: note', () => {
  let initialState: Note[];
  let changedState: Note[];

  beforeEach(() => {
    initialState = [...noteArr];
  });

  describe('type LOAD_NOTE', () => {
    const fakeData: Note[] = [
        new Note({ id: 'testNote1' }),
        new Note({ id: 'testNote2' }),
        new Note({ id: 'testNote3' }),
      ];

    it('should load notes - replace state by received note array', () => {
      changedState = noteReducer(
        initialState,
        new LoadNote(fakeData)
      );

      expect(changedState).not.toEqual(initialState);
      expect(changedState).toEqual(fakeData);
    });
  });

  describe('type ADD_NOTE', () => {
    it('should add notes - state take one note', () => {
      const note: Note = new Note({ id: 'testNote4' });

      changedState = noteReducer(
        initialState,
        new AddNote(note)
      );

      expect(changedState).not.toEqual(initialState);
      expect(changedState).toEqual(initialState.concat(note));
    });
  });

  describe('type UPDATE_NOTE', () => {
    it('should update notes - state change array lessons with same id', () => {
      const updateNote: Note = new Note({ id: initialState[0].id, text: 'test 1' });

      changedState = noteReducer(
        initialState,
        new UpdateNote(updateNote)
      );

      expect(changedState).not.toEqual(initialState);
      expect(changedState.length).toEqual(initialState.length);
      expect(changedState.find(value => value.id === updateNote.id)).toEqual(updateNote);
    });
  });

  describe('type REMOVE_NOTE', () => {
    it('should remove notes - state lost one note', () => {
      const removeNoteId: string = noteArr[0].id;

      changedState = noteReducer(
        initialState,
        new RemoveNote(removeNoteId)
      );

      expect(changedState).not.toEqual(initialState);
      expect(changedState.length).toEqual(initialState.length - 1);
      expect(changedState.findIndex(lesson => lesson.id === removeNoteId)).toEqual(-1);
    });
  });

  describe('type: REMOVE_ALL_NOTE', () => {
    it('should delete notes - remove all notes from state', () => {
      changedState = noteReducer(
        initialState,
        new RemoveAllNote()
      );

      expect(changedState).not.toEqual(initialState);
      expect(changedState).toEqual([]);
    });
  });
});