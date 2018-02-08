import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

import { ForceDirectedGraphResponse } from '../_responses';
import { URL } from '../URL';

@Injectable()
export class MapService {
  private readonly forceDirectedGraphEndpoint: string = URL.api + '/map/data';
  private data: ForceDirectedGraphResponse;

  constructor(private http: Http) {}
  public GetActivePlanets(): Promise <ForceDirectedGraphResponse> {
    if (this.data) {
      return Promise.resolve(this.data);
    }
    return this
      .http
      .get(this.forceDirectedGraphEndpoint)
      .map(value => {
        const response = value.json() as ForceDirectedGraphResponse;
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
