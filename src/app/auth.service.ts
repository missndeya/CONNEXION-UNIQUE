import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IdentifiantDto } from './dtos/identifiant.dto';
import { ActeurDto } from './dtos/acteur.dto';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly loginUrl = 'https://dev1.dgf.sn:8444/sysbudgep-authentification/auth/login';
 //private readonly loginUrl = '/proxy/sysbudgep-authentification/auth/login';
  constructor(private http: HttpClient) {}

  login(identifiant: IdentifiantDto): Observable<ActeurDto> {
    return this.http.post<ActeurDto>(this.loginUrl, identifiant);
  }
}
