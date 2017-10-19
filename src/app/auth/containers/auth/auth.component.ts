import { Component, HostBinding, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { User } from "../../models/user";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  @HostBinding('class.row') row: boolean = true;
  isLogged: boolean;
  user: User;
  error: string;

  constructor(
    private service: AuthService
  ) {
    this.service.isLogged$.subscribe(value => this.isLogged = value);
    this.service.user$.subscribe(value => this.user = value);
  }

  ngOnInit() {}

  authorize (login: string, password: string) {
    if (login === '' || password === '') {
      this.error = 'Заполните все поля.';
    } else {
      this.error = '';
      this.service.login(login, password).subscribe(value => {
        this.user = value;
      }, error => {
        this.error = error.toString();
      });
    }
  }

  logout () {
    if (!this.isLogged) {
      return;
    }

    this.service.logout();
  }
}
