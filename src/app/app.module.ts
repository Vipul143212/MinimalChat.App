import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './_helpers/material/material.module';
import { NgToastModule } from 'ng-angular-popup';
import { NavbarComponent } from './core/navbar/navbar.component';
import { RegisterComponent } from './core/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './core/login/login.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ChatDashboardComponent } from './components/chat-dashboard/chat-dashboard.component';
import { UserChatComponent } from './components/user-chat/user-chat.component';
import { EditMessageDialogComponent } from './_helpers/edit-message-dialog/edit-message-dialog.component';
import { LogListComponent } from './components/log-list/log-list.component';
import { DateTimeFormatPipe } from './_helpers/date-time-format.pipe';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthInterceptor } from './_shared/interceptor/auth.interceptor';
import { AuthGuard } from './_helpers/auth-guard/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegisterComponent,
    LoginComponent,
    UserListComponent,
    ChatDashboardComponent,
    UserChatComponent,
    EditMessageDialogComponent,
    LogListComponent,
    DateTimeFormatPipe,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgToastModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    AuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
