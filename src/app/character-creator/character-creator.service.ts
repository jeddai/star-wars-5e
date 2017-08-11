import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

import { DisciplineResponse } from 'contracts/responses';
import { URL } from 'contracts/URL';

@Injectable()
export class CharacterCreatorService {
  private readonly characterCreatorEndpoint: string = URL.api + '/character/get-classes';

  constructor(private http: Http) {}
  public GetClasses(): Promise <DisciplineResponse> {
    return this
    .http
    .get(this.characterCreatorEndpoint)
    .map(value => {
      const response = value.json() as DisciplineResponse;
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
