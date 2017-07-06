import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';
import * as _ from 'lodash';

import { MonsterManualResponse } from '../responses/MonsterManualResponse';
import { MonsterResponse } from '../responses/MonsterResponse';
import { AbilityScore } from '../classes/AbilityScore';
import { CRSelectItem } from '../classes/CRSelectItem';
import { Monster } from '../classes/Monster';
import { URL } from '../URL';

@Injectable()
export class MonsterManualService {
  private readonly monsterManualEndpoint: string = URL.api + "/monster-manual/get-monsters";
  private readonly monsterEndpoint: string = URL.api + "/monster-manual/get-monster/";

  public hit_die = {
    tiny: { die: 4, half: 2.5 },
    small: { die: 6, half: 3.5 },
    medium: { die: 8, half: 4.5 },
    large: { die: 10, half: 5.5 },
    huge: { die: 12, half: 6.5 },
    gargantuan: { die: 20, half: 10.5 }
  }

  public crs: CRSelectItem[] = [{ "label": "All", "xp": null, "value": null }, 
    { "label": "0", "xp": 10, "value": 0 }, { "label": "1/8", "xp": 25, "value": 0.125 }, { "label": "1/4", "xp": 50, "value": 0.25 }, 
    { "label": "1/2", "xp": 100, "value": 0.5 }, { "label": "1", "xp": 200, "value": 1 }, { "label": "2", "xp": 450, "value": 2 }, 
    { "label": "3", "xp": 700, "value": 3 }, { "label": "4", "xp": 1100, "value": 4}, { "label": "5", "xp": 1800, "value": 5 }, 
    { "label": "6", "xp": 2300, "value": 6 }, { "label": "7", "xp": 2900, "value": 7 }, { "label": "8", "xp": 3900, "value": 8 }, 
    { "label": "9", "xp": 5000, "value": 9 }, { "label": "10", "xp": 5900, "value": 10 }, { "label": "11", "xp": 7200, "value": 11 }, 
    { "label": "12", "xp": 8400, "value": 12 }, { "label": "13", "xp": 10000, "value": 13 }, { "label": "14", "xp": 11500, "value": 14 }, 
    { "label": "15", "xp": 13000, "value": 15 }, { "label": "16", "xp": 15000, "value": 16 }, { "label": "17", "xp": 18000, "value": 17 }, 
    { "label": "18", "xp": 20000, "value": 18 }, { "label": "19", "xp": 22000, "value": 19 }, { "label": "20", "xp": 25000, "value": 20 }];

  constructor(private http: Http) {}
  public GetMonsters(): Promise <MonsterManualResponse> {
    return this
      .http
      .get(this.monsterManualEndpoint)
      .map(value => {
        var response = value.json() as MonsterManualResponse;
        if (!response) {
          throw value.toString();
        } else if (response.Error) {
          throw response.Error;
        }
        return response;
      })
      .toPromise();
  }

  public GetMonster(name: string): Promise <MonsterResponse> {
    return this
      .http
      .get(this.monsterEndpoint + name)
      .map(value => {
        var response = value.json() as MonsterResponse;
        if (!response) {
          throw value.toString();
        } else if (response.Error) {
          throw response.Error;
        }
        return response;
      })
      .toPromise();
  }

  public GetHP(monster: Monster): number {
    return _.ceil((this.hit_die[monster.size].half + AbilityScore.GetScore(monster.ability_scores.con)) * monster.hit_points);
  }

  public RollHP(monster: Monster): number {
    var hp: number = 0;
    var hit: number = this.hit_die[monster.size].die;
    var con: number = AbilityScore.GetScore(monster.ability_scores.con);
    hp += hit + con;
    for(var i = 1; i < monster.hit_points; i++) {
      hp += _.random(1, hit) + con;
    }
    return hp;
  }

  public GetChallenge(cr: number): CRSelectItem {
    var val = _.findIndex(this.crs, function(challenge) { 
      return challenge.value == cr; 
    });
    return this.crs[val];
  }
}
