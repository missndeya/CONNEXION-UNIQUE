import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActeurDto } from './dtos/acteur.dto';
import { AssignationDto } from './dtos/assignation';
import { PageResponse } from './dtos/page-response';
import { ModuleDto } from './dtos/module.dto';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AssignationService {

  private readonly baseUrl = 'https://dev1.dgf.sn:8444/sysbudgep-authentification';
  private readonly executionUrl = environment.backExecutionUrl;

  constructor(private http: HttpClient) {}


    assignationParMatricule(user: ActeurDto, page: number, size: number): Observable<PageResponse<AssignationDto>> {
    return this.http.get<PageResponse<AssignationDto>>(
      `${environment.baseUrl}/assignations/assignationMatriculeActive/${user.actMat}`,
      { params: { page: page.toString(), pageSize: size.toString() } }
    );
  }

  modulesByTypeFonction(typeFonction: string): Observable<ModuleDto[]> {
    return this.http.get<ModuleDto[]>(
      `${this.executionUrl}/assignations/modulesByTypeFonction/${typeFonction}`
    );
  }
}
