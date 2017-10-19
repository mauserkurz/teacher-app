// angular
import { Component, ErrorHandler, HostBinding, OnInit } from '@angular/core';
import { Router } from "@angular/router";
// vendor
import { Store } from "@ngrx/store";
// services
import { AuthService } from "./auth/services/auth.service";
import { IErrorData } from "./common/custom-error-handler";
// state
import { AppState } from "./store/state/app.state";
// selector
import { getConnection } from "./store/reducers/connection.reducer";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
})
export class AppComponent implements OnInit {
  @HostBinding('class.container-fluid') container: boolean = true;
  isLogged: boolean = false;
  loading: boolean = false;
  show: boolean = false;
  error: IErrorData;

  constructor(
    private _router: Router,
    private _store: Store<AppState>,
    private _errorHandler: ErrorHandler,
    public authService: AuthService,
  ) {
    this.authService.isLogged$.subscribe(value => this.isLogged = value);
    this._errorHandler['errors$'].subscribe(error => this.error = error);
    this._store.select(getConnection).subscribe(value => this.loading = value.isWait);
  }

  ngOnInit () {
    this.authService.initAuth();
  }

  logout (): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.isLogged) {
        reject();
      }
      resolve();
    })
      .then(() => {
        return this._router.navigate(['/']);
      })
      .then(() => {
        this.authService.logout();
      });
  }

  toggleMenu (): void {
    this.show = !this.show;
  }

  reload ($window = window): void {
    $window.location.reload();
  }
}
