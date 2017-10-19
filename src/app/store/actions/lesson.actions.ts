import { Action } from "@ngrx/store";
import { type } from "../../helpers/type";
import { Lesson } from "../../core/models/lesson";

export const ActionTypes = {
    LOAD_LESSON: type('LOAD_LESSON'),
    ADD_LESSON: type('ADD_LESSON'),
    UPDATE_LESSON: type('UPDATE_LESSON'),
    REMOVE_LESSON: type('REMOVE_LESSON'),
    REMOVE_ALL_LESSON: type('REMOVE_ALL_LESSON'),
};

export class LoadLesson implements Action {
    type = ActionTypes.LOAD_LESSON;
    payload: { lessons: Lesson[] };

    constructor( lessons: Lesson[] ) {
        this.payload = { lessons };
    }
}

export class AddLesson implements Action {
    type = ActionTypes.ADD_LESSON;
    payload: { lesson: Lesson };

    constructor( lesson: Lesson ) {
        this.payload = { lesson };
    }
}

export class UpdateLesson implements Action {
    type = ActionTypes.UPDATE_LESSON;
    payload: { lesson: Lesson };

    constructor( lesson: Lesson ) {
        this.payload = { lesson };
    }
}

export class RemoveLesson implements Action {
    type = ActionTypes.REMOVE_LESSON;
    payload: { lessonId: string };

    constructor( lessonId: string ) {
        this.payload = { lessonId };
    }
}

export class RemoveAllLesson implements Action {
    type = ActionTypes.REMOVE_ALL_LESSON;
    payload = { lessons: [] };

    constructor() {}
}

export type Actions = LoadLesson | AddLesson | UpdateLesson | RemoveLesson | RemoveAllLesson;