import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class FilterService {

  public filterBy: string[];

  constructor() {}

  public filterArray(array: any[], filter: string): any[] {
    const arrs: any[][] = [];
    _.forEach(filter.split(';'), term => {
      const reg = new RegExp(_.toLower(_.trim(term)), 'i');
      arrs.push(_.filter(array, i => {
        let matches = false;
        _.forEach(this.filterBy, str => {
          if (reg.test(i[str])) { matches = true; }
        });
        return matches;
      }));
    });
    if (arrs.length === 1) {
      return arrs[0];
    }

    let val = arrs[0];
    for (let i = 1; i < arrs.length; i++) {
      val = _.intersectionWith(val, arrs[i], (a, b) => {
        return a.name === b.name;
      });
    }
    return val;
  }

  public active(filterOption: string) {
    return _.includes(this.filterBy, filterOption);
  }

  public toggle(filterOption: string) {
    if (_.includes(this.filterBy, filterOption)) {
      this.filterBy = _.filter(this.filterBy, (option) => {
        return filterOption !== option;
      }).sort();
    } else {
      this.filterBy.push(filterOption);
    }
  }
}
