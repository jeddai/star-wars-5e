export class Combatant {
  name: string;
  armor_class: number;
  current_hit_points: number;
  challenge: number;
  initiative: number;

  constructor() {
    this.name = '';
    this.armor_class = null;
    this.current_hit_points = null;
    this.challenge = null;
    this.initiative = null;
  }

  public static MakeCombatant(name: string, armor_class: number, current_hit_points: number,
                              challenge: number, initiative: number): Combatant {
    let com = new Combatant();
    com.name = name;
    com.armor_class = armor_class;
    com.current_hit_points = current_hit_points;
    com.challenge = challenge;
    com.initiative = initiative;
    return com;
  }
}
