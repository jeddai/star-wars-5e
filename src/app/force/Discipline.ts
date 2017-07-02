import { Ability } from './Ability';

export interface Discipline {
    name: string
    description: string
    order: string
    focus: string
    abilities: Ability[]
}