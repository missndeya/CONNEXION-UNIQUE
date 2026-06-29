import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModuleDto } from '../dtos/module.dto';
import { AssignationDto } from '../dtos/assignation';
import { NavigationService } from '../navigation.service';
import { AssignationService } from '../assignation.service';

@Component({
  selector: 'app-modules',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modules.html',
  styleUrl: './modules.css'
})
export class ModulesComponent implements OnInit {
  modules: ModuleDto[] = [];
  loading = false;
  private assignation: AssignationDto | null = null;
  assignations: AssignationDto[] = [];
  private readonly siglesSupportes = ['EDCB', 'PEPB'];

  get peutChangerFonction(): boolean {
    return this.assignations.length > 1;
  }

  constructor(
    private router: Router,
    private navigationService: NavigationService,
    private assignationService: AssignationService
  ) {}

  ngOnInit(): void {
    this.assignation = history.state?.assignation ?? null;
    this.assignations = history.state?.assignations ?? [];
    const modulesFromState: ModuleDto[] = history.state?.modules ?? [];

    if (modulesFromState.length > 0) {
      this.modules = modulesFromState;
    } else if (this.assignation) {
      this.loading = true;
      this.assignationService.modulesByTypeFonction(this.assignation.foncact_Typfonc_Id).subscribe({
        next: (modules) => {
          this.modules = modules;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  isDisponible(module: ModuleDto): boolean {
    return this.siglesSupportes.includes(module.moduleSigle);
  }

  acceder(module: ModuleDto): void {
    if (!this.isDisponible(module) || !this.assignation) return;
    this.navigationService.acceder(module, this.assignation);
  }

  changerFonction(): void {
    this.router.navigate(['/fonctions'], { state: { assignations: this.assignations } });
  }

  seDeconnecter(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
