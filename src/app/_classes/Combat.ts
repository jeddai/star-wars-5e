import { CRSelectItem } from '../_interfaces';

export class Combat {
  public static XPThresholds = {
    "1": {
      easy: 25,
      medium: 50,
      hard: 75,
      deadly: 100
    },
    "2": {
      easy: 50,
      medium: 100,
      hard: 150,
      deadly: 200
    },
    "3": {
      easy: 75,
      medium: 150,
      hard: 225,
      deadly: 400
    },
    "4": {
      easy: 125,
      medium: 250,
      hard: 375,
      deadly: 500
    },
    "5": {
      easy: 250,
      medium: 500,
      hard: 750,
      deadly: 1100
    },
    "6": {
      easy: 300,
      medium: 600,
      hard: 900,
      deadly: 1400
    },
    "7": {
      easy: 350,
      medium: 750,
      hard: 1100,
      deadly: 1700
    },
    "8": {
      easy: 450,
      medium: 900,
      hard: 1400,
      deadly: 2100
    },
    "9": {
      easy: 550,
      medium: 1100,
      hard: 1600,
      deadly: 2400
    },
    "10": {
      easy: 600,
      medium: 1200,
      hard: 1900,
      deadly: 2800
    },
    "11": {
      easy: 800,
      medium: 1600,
      hard: 2400,
      deadly: 3600
    },
    "12": {
      easy: 1000,
      medium: 2000,
      hard: 3000,
      deadly: 4500
    },
    "13": {
      easy: 1100,
      medium: 2200,
      hard: 3400,
      deadly: 5100
    },
    "14": {
      easy: 1250,
      medium: 2500,
      hard: 3800,
      deadly: 5700
    },
    "15": {
      easy: 1400,
      medium: 2800,
      hard: 4300,
      deadly: 6400
    },
    "16": {
      easy: 1600,
      medium: 3200,
      hard: 4800,
      deadly: 7200
    },
    "17": {
      easy: 2000,
      medium: 3900,
      hard: 5900,
      deadly: 8800
    },
    "18": {
      easy: 2100,
      medium: 4200,
      hard: 6300,
      deadly: 9500
    },
    "19": {
      easy: 2400,
      medium: 4900,
      hard: 7300,
      deadly: 10900
    },
    "20": {
      easy: 2800,
      medium: 5700,
      hard: 8500,
      deadly: 12700
    }
  };

  public static ChallengeRatings: CRSelectItem[] = [{ "label": "All", "xp": null, "value": null },
    { "label": "0", "xp": 10, "value": "0" }, { "label": "1/8", "xp": 25, "value": "1/8" }, { "label": "1/4", "xp": 50, "value": "1/4" },
    { "label": "1/2", "xp": 100, "value": "1/2" }, { "label": "1", "xp": 200, "value": "1" }, { "label": "2", "xp": 450, "value": "2" },
    { "label": "3", "xp": 700, "value": "3" }, { "label": "4", "xp": 1100, "value": "4" }, { "label": "5", "xp": 1800, "value": "5" },
    { "label": "6", "xp": 2300, "value": "6" }, { "label": "7", "xp": 2900, "value": "7" }, { "label": "8", "xp": 3900, "value": "8" },
    { "label": "9", "xp": 5000, "value": "9" }, { "label": "10", "xp": 5900, "value": "10" }, { "label": "11", "xp": 7200, "value": "11" },
    { "label": "12", "xp": 8400, "value": "12" }, { "label": "13", "xp": 10000, "value": "13" }, { "label": "14", "xp": 11500, "value": "14" },
    { "label": "15", "xp": 13000, "value": "15" }, { "label": "16", "xp": 15000, "value": "16" }, { "label": "17", "xp": 18000, "value": "17" },
    { "label": "18", "xp": 20000, "value": "18" }, { "label": "19", "xp": 22000, "value": "19" }, { "label": "20", "xp": 25000, "value":"20" },
    { "label": "21", "xp": 33000, "value":"21" }, { "label": "22", "xp": 41000, "value":"22" }, { "label": "23", "xp": 50000, "value":"23" },
    { "label": "24", "xp": 62000, "value":"24" }, { "label": "25", "xp": 75000, "value":"25" }, { "label": "26", "xp": 90000, "value":"26" },
    { "label": "27", "xp": 105000, "value":"27" }, { "label": "28", "xp": 120000, "value":"28" }, { "label": "29", "xp": 135000, "value":"29" },
    { "label": "30", "xp": 155000, "value":"30" }];

  public static GetMonsterMultiplier(numMonsters: number, numPlayers: number): number {
    const mults: number[] = [ 0.5, 1, 1.5, 2, 2.5, 3, 4 ];
    if(numPlayers > 5) {
      return mults[this.getMultIndex(numMonsters) - 1];
    } else if(numPlayers > 2) {
      return mults[this.getMultIndex(numMonsters)];
    } else {
      let index = this.getMultIndex(numMonsters) + 1;
      if(index > 6) index = 6;
      return mults[index];
    }
  }

  private static getMultIndex(numMonsters: number): number {
    if(numMonsters >= 15)
      return 6;
    else if(numMonsters >= 11)
      return 5;
    else if(numMonsters >= 7)
      return 4;
    else if(numMonsters >= 3)
      return 3;
    else if(numMonsters == 2)
      return 2;
    else
      return 1;
  }
}
