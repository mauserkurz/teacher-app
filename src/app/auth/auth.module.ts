import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";

import { AuthComponent } from './containers/auth/auth.component';
import { authRoutes } from "./containers/auth.routes";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(authRoutes),
  ],
  declarations: [
    AuthComponent,
  ],
  providers: [],
})
export class AuthModule {}
