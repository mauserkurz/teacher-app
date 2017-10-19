import { Matter } from "../../core/models/matter";
import { Group } from "../../core/models/group";
import { Lesson } from "../../core/models/lesson";
import { User } from "../../auth/models/user";
import { Student } from "../../core/models/student";
import { Score } from "../../core/models/score";
import { Note } from "../../core/models/note";
import { IFilterJournal } from "../actions/filter.actions";

export interface AppState {
  user: User;
  connection: { isWait: boolean };
  matters: Matter[];
  groups: Group[];
  lessons: Lesson[];
  students: Student[];
  scores: Score[];
  notes: Note[];
  filter: IFilterJournal;
}