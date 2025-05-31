import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// PrimeNG modules
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { AppComponent } from './app.component';
import { EncuestaFormComponent } from './components/encuesta-form/encuesta-form/encuesta-form.component';
import { EncuestaListComponent } from './components/encuesta-form/encuesta-list/encuesta-list.component';
import { LoginComponent } from './components/login/login.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    EncuestaFormComponent,
    EncuestaListComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule,
    ButtonModule,
    DynamicDialogModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    DialogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }