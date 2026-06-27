import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AssignationDto } from './dtos/assignation';
import { environment } from '../environments/environment';
import { ActeurDto } from './dtos/acteur.dto';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly dashboardExecution = ['COF', 'PIP', 'OBM', 'CPT', 'ORD', 'OBS', 'GES'];

  constructor(private router: Router, private authService: AuthService,) { }

  acteur: ActeurDto | null = null;
  authCode = {
    actMat: "",
    actPrenom: "",
    actNom: "",
    actFoncactId: ""
  }



  async acceder(assignation: AssignationDto): Promise<void> {
    const currentUser = sessionStorage.getItem('currentUser');
    this.acteur = JSON.parse(currentUser || 'null') as ActeurDto | null;

    if (!this.acteur) {
      this.router.navigate(['/login']);
      return;
    }

    const modeChangerFonction =
      sessionStorage.getItem('modeChangerFonction') === 'true';


    let code = this.acteur?.code;

    if (modeChangerFonction) {

      const response = await firstValueFrom(
        this.authService.setInfos(this.acteur)
      );

      if (response.etat === 1) {
        code = response.numero;
      }
    }

    this.rediriger(assignation, code);
  }

  private rediriger(assignation: AssignationDto, code?: string) {

    const type = assignation.foncact_Typfonc_Id;

    if (this.dashboardExecution.includes(type)) {

      window.location.href =
        `${environment.dashboardExecutionUrl}/callback?cd=${encodeURIComponent(code ?? '')}`;

    } else if (type === 'OPSCM') {

      window.location.href =
        `${environment.dashboardElaborationUrl}/callback?cd=${encodeURIComponent(code ?? '')}`;

    } else {

      this.router.navigate(['/non-supporte']);

    }
  }


  // acceder(assignation: AssignationDto): void {

  //   // Vérifier si l'utilisateur veut changer de fonction
  //   const modeChangerFonction = sessionStorage.getItem('modeChangerFonction') === 'true';


  //   const currentUser = sessionStorage.getItem('currentUser');
  //   this.acteur = JSON.parse(currentUser || 'null') as ActeurDto | null;

  //   if (!this.acteur) {
  //     this.router.navigate(['/login']);
  //     return;
  //   }

  //   sessionStorage.setItem('selectedFonction', JSON.stringify(assignation));

  //   const type = assignation.foncact_Typfonc_Id;

  //   // Récupérer le code généré par le backend lors de la connexion, ce code sera utilisé par l'app métier pour récupérer son token
  //   let code = this.acteur?.code;

  //   if (modeChangerFonction) {
  //     this.authService.setInfos(this.acteur).subscribe({
  //       next: (data) => {
  //         const response = data;
  //         console.log('response:', response);
  //         if (response.etat == 1) {
  //           code = response.numero;
  //         } else {
  //           // Afficher message d'erreur
  //           // this.errorMessage = "Aucune fonction assignée à cet utilisateur.";
  //         }
  //       },
  //       error: () => {
  //         // this.errorMessage = "Erreur lors du chargement des fonctions.";
  //       }
  //     });
  //   }



  //   if (this.dashboardExecution.includes(type)) {
  //     console.log('EXXXXXXXX ', environment.dashboardExecutionUrl + `/callback?cd=${encodeURIComponent(code ? code : '')}`);

  //     window.location.href = `${environment.dashboardExecutionUrl}/callback?cd=${encodeURIComponent(code ?? '')}`;
  //   } else if (type === 'OPSCM') {
  //     console.log('ELLLLLLLL ', environment.dashboardElaborationUrl + `/callback?cd=${encodeURIComponent(code ? code : '')}`);
  //     // window.location.href = `${environment.dashboardElaborationUrl}/callback?cd=${encodeURIComponent(code ? code : '')}`;
  //   } else {
  //     this.router.navigate(['/non-supporte']);
  //   }
  // }
}

