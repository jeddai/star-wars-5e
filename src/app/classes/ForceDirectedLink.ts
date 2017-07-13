import { ForceDirectedNode } from './ForceDirectedNode';

export class ForceDirectedLink {
  distance: number
  id: string
  source: ForceDirectedNode
  target: ForceDirectedNode
}