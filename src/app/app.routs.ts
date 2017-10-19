import { Routes } from "@angular/router";
import { LoggingGuardService } from "./auth/services/logging-guard.service";

export const appRoutes: Routes = [
  {
    path: '',
    loadChildren: 'app/auth/auth.module.ts#AuthModule',
  },
  {
    path: 'core',
    loadChildren: 'app/core/core.module.ts#CoreModule',
    canActivate: [ LoggingGuardService ]
  },
  {
    path: '**',
    redirectTo: '',
  }
];
