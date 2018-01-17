import { Ability } from '../_interfaces';

export interface Discipline {
    name: string
    description: string
    order: string
    focus: string
    abilities: Ability[]
}
