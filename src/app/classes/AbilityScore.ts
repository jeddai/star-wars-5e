import * as _ from 'lodash';

export class AbilityScore {
  str: number
  dex: number
  con: number
  int: number
  wis: number
  cha: number

  public static GetScore(num: number): number {
    var x: number = (num - 10) / 2;
    if(x < 0)
      return _.ceil(x);
    else
      return _.floor(x);
  }
}