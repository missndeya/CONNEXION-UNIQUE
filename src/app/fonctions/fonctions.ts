import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AssignationDto } from '../dtos/assignation';
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
  currentPage = 1;
  readonly pageSize = 10;

  get totalPages(): number {
    return Math.ceil(this.assignations.length / this.pageSize);
  }

  get pagedAssignations(): AssignationDto[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.assignations.slice(start, start + this.pageSize);
  }

  constructor(private router: Router, private navigationService: NavigationService) {}

  ngOnInit(): void {
    this.assignations = history.state?.assignations ?? [];
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  acceder(assignation: AssignationDto): void {
    this.navigationService.acceder(assignation);
  }

  seDeconnecter(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
