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
    const currentUser = sessionStorage.getItem('currentUser');
    this.acteur = JSON.parse(currentUser || 'null') as ActeurDto | null;
    const code = this.acteur?.code;

    sessionStorage.setItem('selectedFonction', JSON.stringify(assignation));

    const type = assignation.foncact_Typfonc_Id;

    if (this.dashboardExecution.includes(type)) {
      console.log('EXXXXXXXX ', environment.dashboardExecutionUrl+`/callback?cd=${encodeURIComponent(code?code : '')}&fc=${encodeURIComponent(assignation.foncact_Id ?? '')}`);
      window.location.href = `${environment.dashboardExecutionUrl}/callback?cd=${encodeURIComponent(code ?? '')}&fc=${encodeURIComponent(assignation.foncact_Id ?? '')}`;
    } else if (type === 'OPSCM') {
      console.log('ELLLLLLLL ', environment.dashboardElaborationUrl+`/callback?cd=${encodeURIComponent(code?code : '')}&fc=${encodeURIComponent(assignation.foncact_Id ?? '')}`);
      window.location.href = `${environment.dashboardElaborationUrl}/callback?cd=${encodeURIComponent(code?code : '')}&fc=${encodeURIComponent(assignation.foncact_Id ?? '')}`;
    } else {
      this.router.navigate(['/non-supporte']);
    }
  }
}

