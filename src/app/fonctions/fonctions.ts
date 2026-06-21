import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AssignationDto } from '../dtos/assignation';

@Component({
  selector: 'app-fonctions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fonctions.html',
  styleUrl: './fonctions.css'
})
export class FonctionsComponent implements OnInit {
  assignations: AssignationDto[] = [];
  currentPage = 1;
  readonly pageSize = 10;

  get totalPages(): number {
    return Math.ceil(this.assignations.length / this.pageSize);
  }

  get pagedAssignations(): AssignationDto[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.assignations.slice(start, start + this.pageSize);
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.assignations = history.state?.assignations ?? [];
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  acceder(assignation: AssignationDto): void {
    sessionStorage.setItem('selectedFonction', JSON.stringify(assignation));

    const type = assignation.foncact_Typfonc_Id;
    const dashboardExecution = ['COF', 'PIP', 'OBM', 'CPT', 'ORD', 'OBS', 'GES'];

    if (dashboardExecution.includes(type)) {
      window.location.href = 'https://dev1.dgf.sn/dashboard';
    } else if (type === 'OPSCM') {
      window.location.href = 'http://localhost:4200/dashboards/dashboard4';
    } else {
      this.router.navigate(['/non-supporte']);
    }
  }

  seDeconnecter(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
