import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ModuleDto } from '../dtos/module.dto';
import { AssignationDto } from '../dtos/assignation';
import { NavigationService } from '../navigation.service';
import { AssignationService } from '../assignation.service';
import { ActeurDto } from '../dtos/acteur.dto';

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
  currentUser: ActeurDto | null = null;
  private readonly siglesSupportes = ['EDCB', 'PEPB'];

  get peutChangerFonction(): boolean {
    return this.assignations.length > 1;
  }

  get fullname(): string {
    if (!this.currentUser) return '';
    return [this.currentUser.actPrenom, this.currentUser.actNom]
      .filter(Boolean)
      .join(' ') || this.currentUser.actMat;
  }

  get fonctionLib(): string {
    return this.assignation?.foncact_Lib ?? '';
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private assignationService: AssignationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.assignation = history.state?.assignation ?? null;
    this.assignations = history.state?.assignations ?? [];
    const user = sessionStorage.getItem('currentUser');
    this.currentUser = user ? JSON.parse(user) as ActeurDto : null;
    const modulesFromState: ModuleDto[] = history.state?.modules ?? [];

    if (modulesFromState.length > 0) {
      this.modules = modulesFromState;
    } else if (this.assignation) {
      this.loading = true;
      this.assignationService.modulesByTypeFonction(this.assignation.foncact_Typfonc_Id).subscribe({
        next: (modules) => {
          this.modules = modules;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      const tp = this.route.snapshot.queryParamMap.get('tp');
      if (tp) {
        // Quand l'utilisateur veut changer de module On garde le mode de changement de module
        sessionStorage.setItem('modeAutreApplication', 'true');
        this.loading = true;
        this.assignationService.modulesByTypeFonction(tp).subscribe({
          next: (modules) => {
            this.modules = modules;
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('erreur modulesByTypeFonction tp', err);
            this.loading = false;
            this.cdr.detectChanges();
          }
        });

        if (this.currentUser) {
          this.assignationService.assignationParMatricule(this.currentUser, 0, 10).subscribe({
            next: (data) => {
              this.assignations = data.content;
              this.assignation = data.content.find(a => a.foncact_Typfonc_Id === tp) ?? null;
              this.cdr.detectChanges();
            },
            error: () => { }
          });
        }
      }
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
