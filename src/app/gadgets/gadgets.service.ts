import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

import { GadgetsResponse } from 'contracts/responses';
import { URL } from 'contracts/URL';

@Injectable()
export class GadgetsService {
  private readonly gadgetsEndpoint: string = URL.api + '/gadgets/get-gadgets';

  constructor(private http: Http) {}
  public GetGadgets(): Promise <GadgetsResponse> {
    return this
      .http
      .get(this.gadgetsEndpoint)
      .map(value => {
        const response = value.json() as GadgetsResponse;
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
