export interface Race {
  name: string
  age: number
  alignment: string
  size: string
  speed: {
    walk: number
    fly: number
    swim: number
    climb: number
    burrow: number
  }
  proficiency_number: number
  proficiency: string[]
  tool_proficiency_number: number
  tool_proficiency: string[]
  languages_number: number
  languages: string[]
  ability_score_increases: {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
  }
  abilities: [{
    name: string
    description: string
  }]
}
