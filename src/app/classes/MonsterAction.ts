export class MonsterAction {
  constructor(name: string, desc: string, atk: number, dmgd: string, dmgb: number) {
    this.name = name;
    this.desc = desc;
    this.attack_bonus = atk;
    this.damage_dice = dmgd;
    this.damage_bonus = dmgb
  }

  name: string
  desc: string
  attack_bonus: number
  damage_dice: string
  damage_bonus: number
}