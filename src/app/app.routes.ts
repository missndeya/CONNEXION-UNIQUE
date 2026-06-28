import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { FonctionsComponent } from './fonctions/fonctions';
import { ChangerFonction } from './changer-fonction/changer-fonction';
import { ModulesComponent } from './modules/modules';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'fonctions', component: FonctionsComponent },
  { path: 'changer-fonction', component: ChangerFonction },
  { path: 'modules', component: ModulesComponent },
];
