import { ForceDirectedNode } from 'contracts/interfaces';

export interface ForceDirectedLink {
  distance: number
  id: string
  source: ForceDirectedNode
  target: ForceDirectedNode
}
