import { AbilityScore } from './AbilityScore';
import { MonsterAbility } from './MonsterAbility';
import { MonsterAction } from './MonsterAction';

export class Monster {
  name: string
  size: string
  type: string
  alignment: string
  armor_class: number
  hit_points: string
  speed: string[]
  ability_scores: AbilityScore
  skills: string[]
  damage_vulnerabilities: string[]
  damage_resistances: string[]
  damage_immunities: string[]
  condition_immunities: string[]
  senses: string[]
  languages: string[]
  challenge: number
  abilities: MonsterAbility[]
  actions: MonsterAction[]
}