import { ForceDirectedNode } from '../_interfaces';

export interface ForceDirectedLink {
  distance: number
  id: string
  source: ForceDirectedNode
  target: ForceDirectedNode
}
