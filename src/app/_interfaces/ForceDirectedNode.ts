export interface ForceDirectedNode {
  name: string
  region: string
  sector: string
  system: string
  capital: string
  inhabitants: string[]
  landscape: string
  coordinates: string
  size: number
  hyperspace: {
    distance: number
    planet: string
  }[]
  alignment: string[]
  active: boolean
}
