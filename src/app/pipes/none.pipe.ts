import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({name: 'none'})
export class NonePipe implements PipeTransform {
  transform(value: any): any {
    if(_.isArray(value)) {
      return _.isEmpty(value) ? '–' : value;
    }
    else if(_.isString(value))
      return !!value ? value : '–';
  }
}