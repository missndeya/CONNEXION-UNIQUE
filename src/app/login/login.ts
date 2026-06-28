import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { AuthService } from '../auth.service';
import { AssignationService } from '../assignation.service';
import { SharedService } from '../shared.service';
import { ActeurDto } from '../dtos/acteur.dto';
import { AssignationDto } from '../dtos/assignation';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  username = '';
  password = '';
  database = 'BASE DE FORMATION (DEBUG)';
  errorMessage = '';
  loading = false;

  private currentUser: ActeurDto | null = null;
  private readonly pageSize = 10;

  constructor(
    private router: Router,
    private authService: AuthService,
    private assignationService: AssignationService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
  
    sessionStorage.clear();
}

  onLogin(): void {
    this.errorMessage = '';

    if (!this.username.trim() && !this.password.trim()) {
      this.errorMessage = "L'identifiant et le mot de passe sont obligatoires.";
      return;
    }
    if (!this.username.trim()) {
      this.errorMessage = "L'identifiant est obligatoire.";
      return;
    }
    if (!this.password.trim()) {
      this.errorMessage = 'Le mot de passe est obligatoire.';
      return;
    }

    this.loading = true;

    this.authService.login({ actLogin: this.username.trim(), password: this.password })
      .pipe(finalize(() => { this.loading = false; this.cdr.detectChanges(); }))
      .subscribe({
        next: (acteur) => {
          if (!acteur?.actMat) {
            this.errorMessage = "Cet utilisateur n'existe pas.";
            return;
          }

          sessionStorage.setItem('currentUser', JSON.stringify(acteur));
          sessionStorage.setItem('token', acteur.token);
          this.currentUser = acteur;

          const fullname = [acteur.actPrenom, acteur.actNom]
            .filter(Boolean)
            .join(' ') || acteur.actMat;

          this.sharedService.showToast(`Bienvenue  ${fullname}`, 'success');
          this.chargerFonctions();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.errorMessage = 'Identifiant ou mot de passe incorrect.';
          } else {
            this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
          }
        }
      });
  }

  private chargerFonctions(): void {
    if (!this.currentUser) return;

    this.assignationService.assignationParMatricule(this.currentUser, 0, this.pageSize).subscribe({
      next: (data) => {
        const assignations = data.content;
        //console.log('Assignations:', assignations);
        if (assignations.length > 1) {
          this.router.navigate(['/fonctions'], { state: { assignations } });
        } else if (assignations.length === 1) {
          this.acceder(assignations[0]);
        } else {
          this.errorMessage = "Aucune fonction assignée à cet utilisateur.";
        }
      },
      error: () => {
        this.errorMessage = "Erreur lors du chargement des fonctions.";
      }
    });
  }

  private acceder(assignation: AssignationDto): void {
    this.assignationService.modulesByTypeFonction(assignation.foncact_Typfonc_Id).subscribe({
      next: (modules) => {
        this.router.navigate(['/modules'], {
          state: { modules, assignation, assignations: [assignation] }
        });
      },
      error: () => {
        this.errorMessage = "Erreur lors du chargement des modules.";
      }
    });
  }
}
