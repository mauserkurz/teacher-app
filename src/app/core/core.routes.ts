import { Routes } from "@angular/router";
import { ScheduleComponent } from "./containers/schedule/schedule.component";
import { JournalComponent } from "./containers/journal/journal.component";
import { CoreComponent } from "./containers/core/core.component";

export const coreRoutes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [
      {
        path: '',
        redirectTo: 'schedule',
        pathMatch: 'full',
      },
      {
        path: 'schedule',
        component: ScheduleComponent,
      },
      {
        path: 'journal',
        component: JournalComponent,
      },
    ]
  },
];
