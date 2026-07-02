import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AssignationDto } from '../dtos/assignation';
import { AssignationService } from '../assignation.service';
import { NavigationService } from '../navigation.service';
import { ActeurDto } from '../dtos/acteur.dto';

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
  currentFonctId: String = "";
  readonly pageSize = 6;
  readonly supportedFonctions = ['GES', 'OPSCM', 'ORD','COF','OBS','AGO'];
  currentUser: ActeurDto | null = null;

  isSupporte(assignation: AssignationDto): boolean {
    return this.supportedFonctions.includes(assignation.foncact_Typfonc_Id);
  }

  get fullname(): string {
    if (!this.currentUser) return '';
    return [this.currentUser.actPrenom, this.currentUser.actNom]
      .filter(Boolean)
      .join(' ') || this.currentUser.actMat;
  }

  get initials(): string {
    if (!this.currentUser) return '';
    const letters = [this.currentUser.actPrenom, this.currentUser.actNom]
      .filter(Boolean)
      .map(s => (s as string).charAt(0).toUpperCase());
    return letters.length ? letters.join('') : this.currentUser.actMat.charAt(0).toUpperCase();
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
  ) { }

  ngOnInit(): void {
    this.assignations = history.state?.assignations ?? [];
    const user = sessionStorage.getItem('currentUser');
    this.currentUser = user ? JSON.parse(user) as ActeurDto : null;
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
