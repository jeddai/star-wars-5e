import { ForceDirectedNode, ForceDirectedLink } from '../_interfaces';

export class ShortestHyperspaceLane {
  constructor(nodes, paths, safe, alignment) {
    this.nodes = nodes;
    this.paths = paths;
    this.safe = safe;
    this.alignment = alignment;

    var maxNodes = 500;
    var minNodes = 3;

    if(!nodes.length || nodes.length > maxNodes || nodes.length < minNodes)
        throw this.SpcError(11, 'Nodes format invalid => ' + JSON.stringify(nodes));
  }

  nodes: ForceDirectedNode[];
  paths: ForceDirectedLink[];
  safe: boolean;
  alignment: string;
  distances: object[];
  graph: object;
  result: object;

  public findRoute(source, target): any {
    this.makeDistanceArrayFromNodes();

    this.populateDistances();

    this.result = this.dijkstra(source, target);

    return this.result;
  }

  private makeDistanceArrayFromNodes() {
    this.distances = [];
    for(var i=0; i<this.nodes.length; i++) {
      this.distances[this.nodes[i].name] = [];
      for(var j=0; j<this.nodes.length; j++) {
        this.distances[this.nodes[i].name][this.nodes[j].name] = 'x';
      }
    }
  }

  private populateDistances() {
    for(var i=0; i<this.paths.length; i++) {
      var s = this.paths[i].source.name;
      var t = this.paths[i].target.name;
      var d = this.paths[i].distance;
      if(!!this.safe) {
        var alignment = this.alignment;
        this.paths[i].target.alignment.forEach(function(targetAlignment) {
          if(targetAlignment === 'None') return;
          if(alignment === 'Republic') {
            if(targetAlignment === 'Sith') d += 300;
            else if(targetAlignment === 'Mandalorian') d += 150;
            else if(targetAlignment === 'Hutt') d += 50;
            else if(targetAlignment === 'Chiss') d += 0;
            else if(targetAlignment === 'Contested') d += 500;
          }
          else if(alignment === 'Sith') {
            if(targetAlignment === 'Republic') d += 300;
            else if(targetAlignment === 'Mandalorian') d += 150;
            else if(targetAlignment === 'Hutt') d += 50;
            else if(targetAlignment === 'Chiss') d += 300;
            else if(targetAlignment === 'Contested') d += 500;
          }
          else if(alignment === 'Mandalorian') {
            if(targetAlignment === 'Republic') d += 300;
            else if(targetAlignment === 'Sith') d += 300;
            else if(targetAlignment === 'Chiss') d += 300;
            else if(targetAlignment === 'Hutt') d += 50;
            else if(targetAlignment === 'Contested') d += 500;
          }
          else if(alignment === 'Chiss') {
            if(targetAlignment === 'Republic') d += 0;
            else if(targetAlignment === 'Sith') d += 300;
            else if(targetAlignment === 'Hutt') d += 300;
            else if(targetAlignment === 'Mandalorian') d += 300;
            else if(targetAlignment === 'Contested') d += 500;
          }
        });
      }

      this.distances[s][t] = d;
      this.distances[t][s] = d;
    }
  }

  private dijkstra(start, end) {

    var nodeCount = this.distances.length,
        nodes = this.nodes,
        infinity = 99999,
        shortestPath = {},
        nodeChecked  = {},
        pred         = {};

    for(var p in nodes) {
      shortestPath[getNodeName(p)] = infinity;
      nodeChecked[getNodeName(p)] = false;
      pred[getNodeName(p)] = null;
    }

    shortestPath[start]=0;

    for(var i in nodes) {
      var minDist = infinity;
      var closestNode = null;
      for (var j in nodes) {
        if(!nodeChecked[getNodeName(j)]) {
          if(shortestPath[getNodeName(j)] <= minDist) {
            minDist = shortestPath[getNodeName(j)];
            closestNode = getNodeName(j);
          }
        }
      }
      nodeChecked[closestNode] = true;
      for(var k in nodes) {
        if(!nodeChecked[getNodeName(k)]){
          var nextDistance = distanceBetween(closestNode, getNodeName(k), this.distances);
          if ((parseInt(shortestPath[closestNode]) + parseInt(nextDistance)) < parseInt(shortestPath[getNodeName(k)])){
            var soFar = parseInt(shortestPath[closestNode]);
            var extra = parseInt(nextDistance);
            shortestPath[getNodeName(k)] = soFar + extra;
            pred[getNodeName(k)] = closestNode;
          }
        }
      }
    }

    if(shortestPath[end] < infinity) {
      var newPath = [];
      var step    = { target: end, source: null };
      var v = end;
      while (v !== null) {
        v = pred[v];
        if (v!==null) {
          step.source = v;
          newPath.unshift(step);
          step = { target: v, source: null };
        }
      }
      var totalDistance = shortestPath[end];
      return {mesg:'OK', path: newPath, source: start, target: end, distance:totalDistance};
    }
    else {
      return {mesg:'No path found', path: null, source: start, target: end, distance: 0 };
    }

    function distanceBetween(fromNode, toNode, distances) {
      var dist = distances[fromNode][toNode];
      if(dist==='x') dist = infinity;
      return dist;
    }

    function getNodeName(p) {
      return nodes[p].name;
    }
  }

  private isInteger(i): boolean {
    return /^\d+$/.test(i);
  }

  private SpcError(code, message): object {
    console.log(message);
    return { code: code, message: message };
  }
}
