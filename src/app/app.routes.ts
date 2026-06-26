import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { FonctionsComponent } from './fonctions/fonctions';
import { NonSupporteComponent } from './non-supporte/non-supporte';
import { ChangerFonction } from './changer-fonction/changer-fonction';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'fonctions', component: FonctionsComponent },
  { path: 'non-supporte', component: NonSupporteComponent },
  { path: 'changer-fonction', component: ChangerFonction },
];
