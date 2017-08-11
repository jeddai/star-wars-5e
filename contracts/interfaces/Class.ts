export interface Class {
  class_name: string
  overview: [{
    level: number
    prof: number
    features: string
    other: object
  }]
  features: {
    hit_die: number
    proficiencies: {
      armor: string
      weapons: string
      tools: string
      skill_number: number
      abilities: {
        strength: {
          saving_throws: boolean
          skills: {
            athletics: boolean
          }
        }
        dexterity: {
          saving_throws: boolean
          skills: {
            acrobatics: boolean
            sleight_of_hand: boolean
            stealth: boolean
          }
        }
        constitution: {
          saving_throws: boolean
          skills: {
            demolitions: boolean
          }
        }
        intelligence: {
          saving_throws: boolean
          skills: {
            history: boolean
            investigation: boolean
            nature: boolean
            religion: boolean
            repair: boolean
            security: boolean
          }
        }
        wisdom: {
          saving_throws: boolean
          skills: {
            arcana: boolean
            animal_handling: boolean
            insight: boolean
            medicine: boolean
            perception: boolean
            survival: boolean
          }
        }
        charisma: {
          saving_throws: boolean
          skills: {
            deception: boolean
            intimidation: boolean
            performance: boolean
            persuasion: boolean
          }
        }
      }
    }
    equipment: string[]
    feature_list: [{
      name: string
      description: string
      level: number
    }]
    sub_classes?: [{
      name: string
      description: string
      features: [{
        name: string
        description: string
        level: number
      }]
    }]
  }
}
