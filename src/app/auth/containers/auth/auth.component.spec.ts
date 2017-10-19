// angular
import {
  async,
  ComponentFixture,
  inject,
  TestBed
} from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
// vendor
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/throw";
// service
import { AuthService } from "../../services/auth.service";
// component
import { AuthComponent } from './auth.component';
// mock
import { MockAuthService } from "../../services/mock.auth.service";
// testing data
import { user } from "../../../helpers/data_for_tests";

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      declarations: [
        AuthComponent,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('method: logout', () => {
    it('should do nothing when server is logout', inject([AuthService], (service: MockAuthService) => {
      spyOn<MockAuthService>(service, 'logout').and.callThrough();

      component.logout();

      expect(service.logout).not.toHaveBeenCalled();
    }));

    it('should call logout method of auth service when it is logged ', inject([AuthService], (service: MockAuthService) => {
      spyOn<MockAuthService>(service, 'logout').and.callThrough();
      component.isLogged = true;

      component.logout();

      expect(service.logout).toHaveBeenCalled();
    }));
  });

  describe('method: authorize', () => {
    it('should set Заполните все поля string to error property when login argument is empty string', inject([AuthService], (service: MockAuthService) => {
      spyOn<MockAuthService>(service, 'login').and.callThrough();
      component.authorize('', 'abc');

      expect(service.login).not.toHaveBeenCalled();
      expect(component.error).toEqual('Заполните все поля.');
    }));

    it('should set Заполните все поля string to error property when password argument is empty string', inject([AuthService], (service: MockAuthService) => {
      spyOn<MockAuthService>(service, 'login').and.callThrough();
      component.authorize('abc', '');

      expect(service.login).not.toHaveBeenCalled();
      expect(component.error).toEqual('Заполните все поля.');
    }));

    it('should call login method of service and add returned user as property user', inject([AuthService], (service: MockAuthService) => {
      spyOn<MockAuthService>(service, 'login').and.callThrough();
      component.authorize('login', 'password');

      expect(service.login).toHaveBeenCalledWith('login', 'password');
      expect(component.error).toEqual('');
      expect(component.user).toEqual(user);
    }));

    it('should handle error from service login and set error to property error', inject([AuthService], (service: MockAuthService) => {
      const testError: any = new Error('test error');

      spyOn<MockAuthService>(service, 'login').and.returnValue(Observable.throw(testError));
      component.authorize('login', 'password');

      expect(service.login).toHaveBeenCalledWith('login', 'password');
      expect(component.error).toEqual(testError.toString());
    }));
  });
});
