import { ForceDirectedLink, ForceDirectedNode } from 'contracts/interfaces';

export interface ForceDirectedGraphData {
  nodes: ForceDirectedNode[]
  links: ForceDirectedLink[]
}
