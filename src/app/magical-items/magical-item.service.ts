import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { MagicalItemResponse } from '../responses/MagicalItemResponse';
import 'rxjs/Rx';

import { URL } from '../URL';

@Injectable()
export class MagicalItemService {
  private readonly magicalItemEndpoint: string = URL.api + '/magical-items/get-magical-items';

  constructor(private http: Http) {}
  public GetMagicItems(): Promise <MagicalItemResponse> {
    return this
      .http
      .get(this.magicalItemEndpoint)
      .map(value => {
        let response = value.json() as MagicalItemResponse;
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
