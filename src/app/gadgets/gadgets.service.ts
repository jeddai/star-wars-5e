import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GadgetsResponse } from '../responses/GadgetsResponse';
import 'rxjs/Rx';

import { URL } from '../URL';

@Injectable()
export class GadgetsService {
  private readonly gadgetsEndpoint: string = URL.api + "/gadgets/get-gadgets";

  constructor(private http: Http) {}
  public GetGadgets(): Promise <GadgetsResponse> {
    return this
      .http
      .get(this.gadgetsEndpoint)
      .map(value => {
        var response = value.json() as GadgetsResponse;
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
