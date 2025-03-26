import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { EncuestaListComponent } from './components/encuesta-form/encuesta-list/encuesta-list.component';
import { EncuestaFormComponent } from './components/encuesta-form/encuesta-form/encuesta-form.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'encuestas', 
    component: EncuestaListComponent,
  },
  { 
    path: 'encuestas/nueva', 
    component: EncuestaFormComponent,
  },
  { 
    path: 'encuestas/editar/:id', 
    component: EncuestaFormComponent,
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }