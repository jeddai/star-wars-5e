export class Combatant {
  constructor(name: string, armor_class: number, current_hit_points: number, challenge: number, initiative: number) {
    this.name = name;
    this.armor_class = armor_class;
    this.current_hit_points = current_hit_points;
    this.challenge = challenge;
    this.initiative = initiative;
  }

  name: string
  armor_class: number
  current_hit_points: number
  challenge: number
  initiative: number
}