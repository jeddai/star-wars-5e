import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({name: 'commaSplit'})
export class CommaSplitPipe implements PipeTransform {
  transform(value: string): string {
    return value.split(' ').join(', ');
  }
}
