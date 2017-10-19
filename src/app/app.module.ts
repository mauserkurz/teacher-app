import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";

import { Store, StoreModule } from "@ngrx/store";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { appRoutes } from "./app.routs";
import { rootReducer } from "./store/reducer";
import { AppComponent } from './app.component';
import { environment } from "../environments/environment";
import { httpFactory } from "./common/http-wrapper.service";
import { XHRBackend, RequestOptions, Http, HttpModule } from "@angular/http";
import { LoggingGuardService } from "./auth/services/logging-guard.service";
import { OnlineService, onlineServiceFactory } from "./common/online.service";
import { AuthService } from "./auth/services/auth.service";
import { CustomErrorHandler } from "./common/custom-error-handler";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HttpModule,
    BrowserModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    StoreModule.forRoot(rootReducer),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [
    AuthService,
    LoggingGuardService,
    { provide: ErrorHandler, useClass: CustomErrorHandler },
    { provide: LocationStrategy, useClass: HashLocationStrategy, },
    { provide: LOCALE_ID, useValue: "ru", },
    {
      provide: Http,
      useFactory: httpFactory,
      deps: [ XHRBackend, RequestOptions, Store ],
    },
    {
      provide: OnlineService,
      useFactory: onlineServiceFactory,
      deps: [ Store, Http ],
    },
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
