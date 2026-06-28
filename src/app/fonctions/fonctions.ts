import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AssignationDto } from '../dtos/assignation';
import { AssignationService } from '../assignation.service';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-fonctions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fonctions.html',
  styleUrl: './fonctions.css'
})
export class FonctionsComponent implements OnInit {
  assignations: AssignationDto[] = [];
  loadingId: string | null = null;
  currentPage = 1;
  readonly pageSize = 10;
  readonly supportedFonctions = ['GES', 'OPSCM', 'ORD'];//ORD est à ENLEVER 

  isSupporte(assignation: AssignationDto): boolean {
    return this.supportedFonctions.includes(assignation.foncact_Typfonc_Id);
  }

  get totalPages(): number {
    return Math.ceil(this.assignations.length / this.pageSize);
  }

  get pagedAssignations(): AssignationDto[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.assignations.slice(start, start + this.pageSize);
  }

  constructor(
    private router: Router,
    private assignationService: AssignationService,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.assignations = history.state?.assignations ?? [];
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  acceder(assignation: AssignationDto): void {
    this.loadingId = assignation.foncact_Id;
    this.assignationService.modulesByTypeFonction(assignation.foncact_Typfonc_Id).subscribe({
      next: (modules) => {
        this.loadingId = null;
        if (modules.length === 1) {
          this.navigationService.acceder(modules[0], assignation);
        } else {
          this.router.navigate(['/modules'], { state: { modules, assignation, assignations: this.assignations } });
        }
      },
      error: () => {
        this.loadingId = null;
      }
    });
  }

  seDeconnecter(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
