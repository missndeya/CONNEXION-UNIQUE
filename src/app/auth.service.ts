import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IdentifiantDto } from './dtos/identifiant.dto';
import { ActeurDto } from './dtos/acteur.dto';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  constructor(private http: HttpClient) {}

  login(identifiant: IdentifiantDto): Observable<ActeurDto> {
    return this.http.post<ActeurDto>(environment.loginUrl, identifiant);
  }
}
