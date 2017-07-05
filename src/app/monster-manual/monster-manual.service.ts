import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { MonsterManualResponse } from '../responses/MonsterManualResponse';
import 'rxjs/Rx';

import { URL } from '../URL';

@Injectable()
export class MonsterManualService {
  private readonly magicalItemEndpoint: string = URL.api + "/magical-items/get-magical-items";

  constructor(private http: Http) {}
  public GetMagicItems(): Promise <MonsterManualResponse> {
    return this
      .http
      .get(this.magicalItemEndpoint)
      .map(value => {
        var response = value.json() as MonsterManualResponse;
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
