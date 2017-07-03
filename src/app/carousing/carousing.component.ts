import { Component } from '@angular/core';

import { CarousingRolls } from './CarousingRolls';
import { CarousingResult } from './CarousingResult';

@Component({
  selector: 'carousing',
  templateUrl: './carousing.component.html',
  styleUrls: ['./carousing.component.css']
})
export class CarousingComponent {

  public numPlayers: number = 1;
  public players: string[] = ["Player 1"];
  public res: CarousingResult[] = [];
  public specResult: number = null;
  public limitResults: number = 5;

  public roll(): void {
    this.res.unshift(this.getCarousingResult());
    if(!!this.limitResults && this.res.length > this.limitResults)
      while(this.res.length > this.limitResults)
        this.res.pop();
  }

  private getCarousingResult(): CarousingResult {
    var i = 0;
    var randomNumber;
    if(!!this.specResult) {
      randomNumber = this.specResult - 1;
    } else {
      randomNumber = Math.floor((Math.random() * CarousingRolls[this.numPlayers].length));
    }
    var result = CarousingRolls[this.numPlayers][randomNumber];
    if(this.numPlayers !== 1) {
      var arr = this.shuffle(this.players);
      for(i = 1; i <= this.numPlayers; i++) {
        result = result.replaceAll("&" + i, arr[i - 1]);
      }
    }
    if(result.search("{") !== -1) {
      var matches = result.match(/{[^}]*}/g);
      for(i = 0; i < matches.length; i++) {
        var val = matches[i].substr(1,matches[i].length-2);
        if(val.search("return") !== -1) {
          var func = new Function(val);
          result = result.replace(matches[i], func());
        }
        else {
          result = result.replace(matches[i], eval(val));
        }
      }
    }
    if(result.search("~") !== -1) {
      var die = result.match(/~(.*?)~/);
      var numberOfDice = parseInt(die[1].match(/^(.*?)d/)[1]);
      var maxNumber = parseInt(die[1].match(/d(.*)/)[1]);
      result = result.replace(/~(.*?)~/, this.rollDice(numberOfDice, maxNumber));
    }
    return <CarousingResult>{
      "result":result,
      "resultNumber": randomNumber + 1,
      "maxNumber": CarousingRolls[this.numPlayers].length
    };
  }

  private rollDice(dice, number): number {
    var total = 0;
    if(dice <= 10) {
      for(var i = 0; i < dice; i++) {
        total += Math.floor((Math.random() * number) + 1);
      }
    }
    else {
      total = Math.floor(((Math.random() * number) + 1) * dice);
    }
    return total;
  }

  public updatePlayers() {
    if(this.players.length < this.numPlayers) {
      for(var i = this.players.length + 1; i <= this.numPlayers; i++) {
        this.players.push("Player " + i);
      }
    } else if(this.players.length > this.numPlayers) {
      this.players.splice(this.numPlayers, this.players.length);
    }
  }

  private shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
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
