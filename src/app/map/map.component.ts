import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

import { ForceDirectedGraphData } from './ForceDirectedGraphData';
import { ForceDirectedNode } from './ForceDirectedNode';
import { MapService } from './map.service';
import { Colors } from '../Constants';

const baseLineColor = '#aaa',
      highlightLineColor = '#777',
      mapLineColor = '#e00';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  constructor(private mapService: MapService) {}

  public groupings: string[] = ['hyperspace'];
  public groupBy: string = 'climate';
  public alignment: string = 'Republic';
  public safe: string = 'false';
  public highlighted: any;

  /* Data and element variables */
  private data: ForceDirectedGraphData;
  private main;
  private legend;

  /* Private variables */
  private svg;
  private width;
  private height;
  private aspect;
  private transform;

  ngOnInit() {
    this.main = document.getElementById('main');
    this.svg = d3.select('svg');
    this.width = parseInt(this.svg.attr('width'));
    this.height = parseInt(this.svg.attr('height'));
    this.aspect = this.width / this.height;
    this.transform = d3.zoomIdentity;

    this.refreshData();
  }

  public refreshData(): void {
    this.mapService.GetActivePlanets()
    .then((res) => {
      this.data = res.Response;
      this.initializeForceDirectedGraph();
    })
    .catch(err => console.error(err));
  }

  private initializeForceDirectedGraph(): void {
    var component = this;

    component.legend = d3.select('#legend')
    .html(component.legendHtml(null));

    if (!component.data) {
      return;
    }
    component.svg.html('');
    var simulation = d3.forceSimulation()
    .force('link', d3.forceLink()
    .id(function (d) {
      return d.name;
    }).distance(function(p) {
      if(p.distance) return p.distance;
      else return 50;
    }))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(component.width / 2, component.height / 2));

    var link = component.svg.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(component.data.links)
    .enter()
    .append('line')
    .attr('stroke-width', 2)
    .attr('stroke', baseLineColor);

    var selectedLines = null;

    component.svg.on("click", function(p) {
      d3.selectAll("line")
      .attr('stroke-width', 2)
      .attr('stroke', baseLineColor);

      component.legend.html(component.legendHtml(null));
    });

    var node = component.svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(component.data.nodes)
      .enter()
      .append('circle')
      .attr('r', 7)
      .attr('fill', function (p) {
        move(p);
        if(component.groupBy === 'climate') {
          return Colors.climateColors[p.climate];
        } else if(component.groupBy === 'alignment') {
          if(typeof p.alignment !== 'object') return Colors.alignmentColors['None'];
          var mainAlignment = p.alignment[0];
          if(mainAlignment)
            return Colors.alignmentColors[mainAlignment];
          else
            return Colors.alignmentColors['None'];
        } else if(component.groupBy === 'region') {
          return Colors.regionColors[p.region];
        }
      })
      .on('mouseover', highlight)
      .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

      function move(p) {
        p.x = getCoords(p.coordinates, 'x');
        p.y = getCoords(p.coordinates, 'y');
      }

      function getCoords(mapCoord, axis) {
        if(axis === 'x') return (mapCoord.charCodeAt(0) - 64) * 75;
        else if(axis === 'y') return (parseInt(mapCoord.slice(mapCoord.search('-')+1, 4))) * 75;
      }

      function getAttachedLinks(currCircle, line) {
        return (isClose(currCircle.cx.baseVal.value, line.target.x) && isClose(currCircle.cy.baseVal.value, line.target.y))
            || (isClose(currCircle.cx.baseVal.value, line.source.x) && isClose(currCircle.cy.baseVal.value, line.source.y));
      }

      function isClose(a, b) {
        return a + 5 > b && a - 5 < b;
      }

      component.svg.call(d3.zoom()
      .scaleExtent([1 / 2, 8])
      .on("zoom", zoomed));

      node.append('title')
      .text(function (d) {
        return d.name;
      });

      simulation
      .nodes(component.data.nodes)
      .on('tick', ticked);

      simulation.force('link')
      .links(component.data.links);

      function ticked() {
        link
        .attr('x1', function (d) {
          return d.source.x;
        })
        .attr('y1', function (d) {
          return d.source.y;
        })
        .attr('x2', function (d) {
          return d.target.x;
        })
        .attr('y2', function (d) {
          return d.target.y;
        });

        node
        .attr('cx', function (d) {
          return d.x;
        })
        .attr('cy', function (d) {
          return d.y;
        });
      }

      function zoomed() {
        link.attr('transform', d3.event.transform);
        node.attr('transform', d3.event.transform);
      }

      function dragstarted(d) {
        if (!d3.event.active) {
          simulation.alphaTarget(0.3)
          .restart();
        }
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended(d) {
        if (!d3.event.active) {
          simulation.alphaTarget(0);
        }
        d.fx = null;
        d.fy = null;
      }

      function highlight(p) {
        component.highlighted = p;

        if(selectedLines){
          selectedLines
          .attr('stroke-width', 2)
          .attr('stroke', baseLineColor);
        }

        var currCircle = this;
        selectedLines = d3.selectAll("line")
        .filter(function(line) {
          return getAttachedLinks(currCircle, line);
        })
        .attr('stroke-width', 3)
        .attr('stroke', highlightLineColor);

        component.legend.html(component.legendHtml(p));
      }

      function redraw(){
        if(component.main.clientHeight < component.main.clientWidth)
          component.svg.attr("width", Math.min(component.main.clientWidth, component.width))
          .attr("height", Math.min(component.main.clientWidth, component.width));
        else
          component.svg.attr("width", Math.min(component.main.clientHeight, component.height))
          .attr("height", Math.min(component.main.clientHeight, component.height));
      }

      // Draw for the first time to initialize.
      redraw();

      // Redraw based on the new size whenever the browser window is resized.
      window.addEventListener("resize", redraw);
  }

  private legendHtml(p: ForceDirectedNode) : string {
    var html:string = '';
    if(this.groupBy === 'climate') {
      html += '<h5>Climates:</h5><ul>';
      for (let key in Colors.climateColors) {
        html += '<li style="color:' + Colors.climateColors[key] + ';">' + key
            + '</li>';
      }
      html += '</ul>';
    }
    if(this.groupBy === 'alignment') {
      html += '<h5>Alignments:</h5><ul>';
      for (let key in Colors.alignmentColors) {
        html += '<li style="color:' + Colors.alignmentColors[key] + ';">' + key
            + '</li>';
      }
      html += '</ul>';
    }
    if(!!p) {
      html += '<h5>Highlighted Planet:</h5>';
      html += '<div>';
      html += this.getPlanetTooltip(p);
      html += '<br/><i><small>Click anywhere on the map to deselect</small></i>';
      html += '</div>';
    }
    return html;
  }

  private getPlanetTooltip(p: ForceDirectedNode): string {
    var html:string = '';

    if(!!p.name) html += '<b>' + p.name + '</b><br/>';
    if(!!p.region) html += 'Region: ' + p.region;
    if(!!p.sector) html += '<br/>Sector: ' + p.sector;
    if(!!p.system) html += '<br/>System: ' + p.system;
    if(!!p.capital) html += '<br/>Capital: ' + p.capital;
    if(!!p.climate) html += '<br/>Climate: ' + p.climate;
    if(!!p.inhabitants) {
      html += '<br/>Inhabitants: ';
      p.inhabitants.forEach(function(inhab, i) {
        html += inhab;
        if(i != p.inhabitants.length - 1) html += ', ';
      });
    }
    if(!!p.coordinates) html += '<br/>Coordinates: ' + p.coordinates;

    return html;
  }
  
  /*

    function getDirections(p1, p2) {
      var sp = new ShortestPathCalculator(vm.data.nodes, vm.data.links, vm.safe === 'true', vm.alignment);
      if(!p1 || !p2) {
        showToast('Please enter valid planet names');
        return;
      }
      d3.selectAll("line").attr('stroke-width', 2)
      .attr('stroke', baseLineColor);
      path = sp.findRoute(p1, p2);
      path.distance = findDistance(path.path);
      if(path.mesg === 'OK') {
        vm.path = path;
        path = path.path;
        vm.error = '';
      } else {
        vm.path = {};
        showToast(path.mesg);
      }
      d3.selectAll("line")
      .filter(function(line) {
        for(var i = 0; i < path.length; i++) {
          if(line.id.includes(path[i].source) && line.id.includes(path[i].target))
            return true;
        }
        return false;
        // return line.source.name === p1 || line.target.name === p1 || line.source.name === p2 || line.target.name === p2;
      })
      .attr('stroke', mapLineColor);
    }

    function findDistance(path) {
      var dist = 0;
      if(typeof path === 'object' && !!path)
        path.forEach(function(p) {
          var arr = angular.copy(vm.data.links);
          arr = arr.filter(function(link) {
            return link.id.includes(p.source) && link.id.includes(p.target);
          });
          dist += arr[0].distance;
        });
      return dist;
    }
  }*/
}
