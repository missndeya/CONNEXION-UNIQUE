import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AssignationDto } from './dtos/assignation';
import { ModuleDto } from './dtos/module.dto';
import { environment } from '../environments/environment';
import { ActeurDto } from './dtos/acteur.dto';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavigationService {

  constructor(private router: Router, private authService: AuthService,) { }

  acteur: ActeurDto | null = null;
  authCode = {
    actMat: "",
    actPrenom: "",
    actNom: "",
    actFoncactId: ""
  }



  async acceder(module: ModuleDto, _assignation: AssignationDto): Promise<void> {
    
    const currentUser = sessionStorage.getItem('currentUser');
    this.acteur = JSON.parse(currentUser || 'null') as ActeurDto | null;

    if (!this.acteur) {
      this.router.navigate(['/login']);
      return;
    }

    const modeChangerFonction =
     // sessionStorage.getItem('modeChangerFonction') === 'true';
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

    this.rediriger(module, code, _assignation.foncact_Id);
  }

  isSupporte(module: ModuleDto): boolean {
    return module.moduleSigle === 'EDCB' || module.moduleSigle === 'PEPB';
  }

  private rediriger(module: ModuleDto, code: string, foncactId:string) {
    console.log('CODE BACKEND',code);
    
    if (module.moduleSigle === 'EDCB') {
      window.location.href =
        `${environment.dashboardExecutionUrl}/sysbudgep/callback?cd=${encodeURIComponent(code ?? '')}&fc=${encodeURIComponent(foncactId)}`;
    } else if (module.moduleSigle === 'PEPB') {
      window.location.href =
        `${environment.dashboardElaborationUrl}/callback?cd=${encodeURIComponent(code ?? '')}&fc=${encodeURIComponent(foncactId)}`;
    }
  }
}
