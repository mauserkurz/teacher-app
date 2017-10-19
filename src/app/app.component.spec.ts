// angular
import { Router } from "@angular/router";
import { ErrorHandler } from "@angular/core";
import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpModule, XHRBackend } from "@angular/http";
import { MockBackend } from "@angular/http/testing";
// vendor
import { Store } from "@ngrx/store";
// component
import { AppComponent } from './app.component';
// services
import { AuthService } from "./auth/services/auth.service";
import { CustomErrorHandler } from "./common/custom-error-handler";
// mocks
import { MockStore } from "./store/mock.store";
import { MockAuthService } from "./auth/services/mock.auth.service";

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        RouterTestingModule,
      ],
      declarations: [
        AppComponent,
      ],
      providers: [
        {
          provide: ErrorHandler,
          useClass: CustomErrorHandler,
        },
        {
          provide: Store,
          useClass: MockStore,
        },
        {
          provide: XHRBackend,
          useClass: MockBackend,
        },
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  describe('method: ngOnInit', () => {
    it('should call initAuth method of service', () => {
      spyOn<AuthService>(app.authService, 'initAuth').and.callThrough();

      app.ngOnInit();

      expect(app.authService.initAuth).toHaveBeenCalled();
    });
  });

  describe('method: logout', () => {
    it('should if user isn`t logged reject returned promise', (done) => {
      app.logout().then(() => {
          done.fail(new Error('there rejection must not be'))
        }, () => {
          done();
        }
      );
    });

    it('should call authService.logout after final resolve', (done) => {
      spyOn<AuthService>(app.authService, 'logout');
      app.isLogged = true;

      app.logout().then(() => {
        expect(app.authService.logout).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('method: toggleMenu', () => {
    it('should toggle menu state for close/open', () => {
      const initState: boolean = app.show;

      app.toggleMenu();

      expect(!initState).toEqual(app.show);
    });
  });

  describe('method: reload', () => {
    it('should call window.location.reload and accordingly reload page', () => {
      const win: any = {
        location: {
          reload: () => {},
        },
      };

      spyOn<any>(win.location, 'reload');

      app.reload(win);
      expect(win.location.reload).toHaveBeenCalled();
    });
  });
});
