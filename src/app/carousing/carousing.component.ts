import { Component } from '@angular/core';
import * as _ from 'lodash';

import { CarousingResult } from '../_interfaces';
import { CarousingRolls } from '../_classes';

@Component({
  selector: 'app-carousing',
  templateUrl: './carousing.component.html',
  styleUrls: ['./carousing.component.scss']
})
export class CarousingComponent {

  public numPlayers = 1;
  public players: string[] = ['Player 1'];
  public res: CarousingResult[] = [];
  public specResult: number = null;
  public limitResults = 5;

  public roll(): void {
    this.res.unshift(this.getCarousingResult());
    if (!!this.limitResults && this.res.length > this.limitResults) {
      while (this.res.length > this.limitResults) {
        this.res.pop();
      }
    }
  }

  private getCarousingResult(): CarousingResult {
    let i = 0;
    let randomNumber;
    if (!!this.specResult) {
      randomNumber = this.specResult - 1;
    } else {
      randomNumber = Math.floor((Math.random() * CarousingRolls[this.numPlayers].length));
    }
    let result = CarousingRolls[this.numPlayers][randomNumber];
    if (this.numPlayers !== 1) {
      const arr = this.shuffle(_.cloneDeep(this.players));
      for (i = 1; i <= this.numPlayers; i++) {
        result = this.replaceAll(result, '&' + i, arr[i - 1]);
      }
    }
    if (result.search('{') !== -1) {
      const matches = result.match(/{[^}]*}/g);
      for (i = 0; i < matches.length; i++) {
        const val = matches[i].substr(1, matches[i].length - 2);
        if (val.search('return') !== -1) {
          const func = new Function(val);
          result = result.replace(matches[i], func());
        } else {
          result = result.replace(matches[i], eval(val));
        }
      }
    }
    if (result.search('~') !== -1) {
      const die = result.match(/~(.*?)~/);
      const numberOfDice = parseInt(die[1].match(/^(.*?)d/)[1], 10);
      const maxNumber = parseInt(die[1].match(/d(.*)/)[1], 10);
      result = result.replace(/~(.*?)~/, this.rollDice(numberOfDice, maxNumber));
    }
    return <CarousingResult>{
      'result': result,
      'resultNumber': randomNumber + 1,
      'maxNumber': CarousingRolls[this.numPlayers].length
    };
  }

  private replaceAll(str, search, replacement): string {
    return str.split(search).join(replacement);
  }

  private random(number): number {
    return Math.floor(Math.random() * number);
  }

  private rollDice(dice, number): number {
    let total = 0;
    if (dice <= 10) {
      for (let i = 0; i < dice; i++) {
        total += Math.floor((Math.random() * number) + 1);
      }
    } else {
      total = Math.floor(((Math.random() * number) + 1) * dice);
    }
    return total;
  }

  public updatePlayers() {
    if (this.players.length < this.numPlayers) {
      for (let i = this.players.length + 1; i <= this.numPlayers; i++) {
        this.players.push('Player ' + i);
      }
    } else if (this.players.length > this.numPlayers) {
      this.players.splice(this.numPlayers, this.players.length);
    }
  }

  private shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
}
