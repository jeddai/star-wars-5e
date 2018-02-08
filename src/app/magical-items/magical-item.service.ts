import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

import { MagicalItemResponse } from '../_responses';
import { URL } from '../URL';

@Injectable()
export class MagicalItemService {
  private readonly magicalItemEndpoint: string = URL.api + '/magical-items/get-magical-items';
  private data: MagicalItemResponse;

  constructor(private http: Http) {}
  public GetMagicItems(): Promise <MagicalItemResponse> {
    if (this.data) {
      return Promise.resolve(this.data);
    }
    return this
      .http
      .get(this.magicalItemEndpoint)
      .map(value => {
        const response = value.json() as MagicalItemResponse;
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
