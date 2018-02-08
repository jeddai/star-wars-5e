import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

import { DisciplineResponse } from '../_responses';
import { URL } from '../URL';

@Injectable()
export class ForceService {
  private readonly disciplineEndpoint: string = URL.api + '/force/get-disciplines';
  private data: DisciplineResponse;

  constructor(private http: Http) {}
  public GetDisciplines(): Promise <DisciplineResponse> {
    if (this.data) {
      return Promise.resolve(this.data);
    }
    return this
      .http
      .get(this.disciplineEndpoint)
      .map(value => {
        const response = value.json() as DisciplineResponse;
        this.data = response;
        if (!response) {
          throw value.toString();
        } else if (response.Error) {
          throw response.Error;
        }
        return response;
      })
      .toPromise();
  }
}
