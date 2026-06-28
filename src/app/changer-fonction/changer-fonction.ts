import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActeurDto } from '../dtos/acteur.dto';
import { AssignationService } from '../assignation.service';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-changer-fonction',
  standalone: true,
  template: `
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="text-center">
        <div class="spinner-border text-primary mb-3"></div>
        <div>Chargement des fonctions...</div>
      </div>
    </div>
  `
})
export class ChangerFonction implements OnInit {

  private currentUser: ActeurDto | null = null;
  readonly pageSize = 10;

  constructor(
    private router: Router,
    private assignationService: AssignationService,
    private navigationService: NavigationService,
  ) {}

  ngOnInit(): void {

    // Quand l'utilisateur veut changer de fonction On garde le mode de changement de fonction
    sessionStorage.setItem('modeChangerFonction', 'true');

    const user = sessionStorage.getItem('currentUser');

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = JSON.parse(user);
    if (!this.currentUser) return;

    this.assignationService
      .assignationParMatricule(this.currentUser, 0, this.pageSize)
      .subscribe({
        next: (data) => {

          const assignations = data.content;

          if (assignations.length > 1) {

            this.router.navigate(['/fonctions'], {
              state: { assignations }
            });

          } else if (assignations.length === 1) {

            const assignation = assignations[0];
            this.assignationService.modulesByTypeFonction(assignation.foncact_Typfonc_Id).subscribe({
              next: (modules) => {
                if (modules.length > 0) {
                  this.navigationService.acceder(modules[0], assignation);
                } else {
                  this.router.navigate(['/fonctions'], { state: { assignations } });
                }
              },
              error: () => this.router.navigate(['/fonctions'], { state: { assignations } })
            });

          } else {

            this.router.navigate(['/login']);

          }

        },
        error: () => {
          this.router.navigate(['/login']);
        }
      });

  }
}