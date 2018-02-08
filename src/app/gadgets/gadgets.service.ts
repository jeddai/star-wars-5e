import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

import { GadgetsResponse } from '../_responses';
import { URL } from '../URL';

@Injectable()
export class GadgetsService {
  private readonly gadgetsEndpoint: string = URL.api + '/gadgets/get-gadgets';
  private data: GadgetsResponse;

  constructor(private http: Http) {}
  public GetGadgets(): Promise <GadgetsResponse> {
    if (this.data) {
      return Promise.resolve(this.data);
    }
    return this
      .http
      .get(this.gadgetsEndpoint)
      .map(value => {
        const response = value.json() as GadgetsResponse;
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
