import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AssignationService } from '../assignation.service';
import { ActeurDto } from '../dtos/acteur.dto';

@Component({
  selector: 'app-non-supporte',
  standalone: true,
  templateUrl: './non-supporte.html',
  styleUrl: './non-supporte.css'
})
export class NonSupporteComponent {
  loading = false;

  constructor(
    private router: Router,
    private assignationService: AssignationService
  ) {}

  retour(): void {
    const stored = sessionStorage.getItem('currentUser');
    if (!stored) {
      this.router.navigate(['/login']);
      return;
    }

    const currentUser: ActeurDto = JSON.parse(stored);
    this.loading = true;

    this.assignationService.assignationParMatricule(currentUser, 0, 10).subscribe({
      next: (data) => {
        this.loading = false;
        this.router.navigate(['/fonctions'], { state: { assignations: data.content } });
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      }
    });
  }
}
