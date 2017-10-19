import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { coreRoutes } from "./core.routes";
import { ScheduleService } from "./services/schedule.service";

import { CoreComponent } from './containers/core/core.component';
import { ScheduleComponent } from './containers/schedule/schedule.component';
import { JournalComponent } from './containers/journal/journal.component';
import { GroupListComponent } from './components/group-list/group-list.component';
import { LessonViewComponent } from './components/lesson-view/lesson-view.component';
import { LessonFormComponent } from './components/lesson-form/lesson-form.component';
import { JournalService } from "./services/journal.service";
import { JournalViewComponent } from './components/journal-view/journal-view.component';
import { JournalFilterComponent } from './components/journal-filter/journal-filter.component';
import { NoteFormComponent } from './components/note-form/note-form.component';
import { ScoreFormComponent } from './components/score-form/score-form.component';

@NgModule({
  imports: [
    RouterModule.forChild(coreRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  declarations: [
    CoreComponent,
    ScheduleComponent,
    JournalComponent,
    GroupListComponent,
    LessonViewComponent,
    LessonFormComponent,
    JournalViewComponent,
    JournalFilterComponent,
    NoteFormComponent,
    ScoreFormComponent,
  ],
  providers: [
    ScheduleService,
    JournalService,
  ]
})
export class CoreModule { }
