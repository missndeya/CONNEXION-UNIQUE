import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AssignationDto } from './dtos/assignation';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly dashboardExecution = ['COF', 'PIP', 'OBM', 'CPT', 'ORD', 'OBS', 'GES'];

  constructor(private router: Router) {}

  acceder(assignation: AssignationDto): void {
    sessionStorage.setItem('selectedFonction', JSON.stringify(assignation));

    const type = assignation.foncact_Typfonc_Id;

    if (this.dashboardExecution.includes(type)) {
      window.location.href = 'https://dev1.dgf.sn/dashboard';
    } else if (type === 'OPSCM') {
      window.location.href = 'http://localhost:4200/dashboards/dashboard';
    } else {
      this.router.navigate(['/non-supporte']);
    }
  }
}
