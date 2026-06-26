import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AssignationDto } from './dtos/assignation';
import { environment } from '../environments/environment';
import { ActeurDto } from './dtos/acteur.dto';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly dashboardExecution = ['COF', 'PIP', 'OBM', 'CPT', 'ORD', 'OBS', 'GES'];

  constructor(private router: Router) {}

  acteur: ActeurDto | null = null;
  


  acceder(assignation: AssignationDto): void {

    // Vérifier si l'utilisateur veut changer de fonction
    const modeChangerFonction = sessionStorage.getItem('modeChangerFonction') === 'true';

    const currentUser = sessionStorage.getItem('currentUser');
    this.acteur = JSON.parse(currentUser || 'null') as ActeurDto | null;

    // Récupérer le code généré par le backend lors de la connexion, ce code sera utilisé par l'app métier pour récupérer son token
    const code = this.acteur?.code;

    sessionStorage.setItem('selectedFonction', JSON.stringify(assignation));

    const type = assignation.foncact_Typfonc_Id;

    if (this.dashboardExecution.includes(type)) {
      console.log('EXXXXXXXX ', environment.dashboardExecutionUrl+`/callback?cd=${encodeURIComponent(code?code : '')}`);

      window.location.href = `${environment.dashboardExecutionUrl}/callback?cd=${encodeURIComponent(code ?? '')}`;
    } else if (type === 'OPSCM') {
      console.log('ELLLLLLLL ', environment.dashboardElaborationUrl+`/callback?cd=${encodeURIComponent(code?code : '')}`);
      window.location.href = `${environment.dashboardElaborationUrl}/callback?cd=${encodeURIComponent(code?code : '')}`;
    } else {
      this.router.navigate(['/non-supporte']);
    }
  }
}

