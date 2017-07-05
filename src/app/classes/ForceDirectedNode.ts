export class ForceDirectedNode {
  name: string
  region: string
  sector: string
  system: string
  capital: string
  inhabitants: string[]
  climate: string
  coordinates: string
  hyperspace: {
    distance: number
    planet: string
  }[]
  alignment: string[]
  active: boolean
}