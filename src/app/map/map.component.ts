import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message } from 'primeng/primeng';
import * as d3 from 'd3';
import * as _ from 'lodash';

import { Colors } from '../Colors';
import { ForceDirectedGraphData, ForceDirectedNode } from '../_interfaces';
import { ShortestHyperspaceLane } from '../_classes';
import { MapService } from './map.service';

const baseLineColor = '#eee',
      highlightLineColor = '#aaa',
      mapLineColor = '#e00';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  public messages: Message[] = [];
  public groupings: string[] = ['hyperspace'];
  public groupBy = 'landscape';
  public alignment = 'Republic';
  public safe = 'false';
  public highlighted: any;
  public p1: ForceDirectedNode;
  public p2: ForceDirectedNode;
  public planets: string[] = [];
  public planets1: string[] = [];
  public planets2: string[] = [];
  private path;

  /* Data and element variables */
  private data: ForceDirectedGraphData;
  private legend;

  /* Private variables */
  private svg;
  private width;
  private height;
  private aspect;
  private transform;

  constructor(private mapService: MapService) {}

  ngOnInit() {
    this.svg = d3.select('#main svg');
    this.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    this.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) * .85;
    this.aspect = this.width / this.height;
    this.transform = d3.zoomIdentity;

    this.mapService.GetActivePlanets()
    .then((res) => {
      this.data = res.Response;
      this.data.nodes.forEach((n) => {
        this.planets.push(n.name);
      });
      this.initializeForceDirectedGraph();
    })
    .catch(err => console.error(err));
  }

  ngOnDestroy() {
    this.svg.html('');
    this.svg.remove();
  }

  public search(list: string, event) {
    this[list] = _.filter(this.planets, (s) => {
      return s.toLowerCase().includes(event.query.toLowerCase());
    });
  }

  public initializeForceDirectedGraph(): void {
    const component = this;

    component.legend = d3.select('#legend')
    .html(component.legendHtml(null));

    if (!component.data) {
      return;
    }
    component.svg.html('');
    const simulation = d3.forceSimulation()
    .force('link', d3.forceLink()
    .id(function (d) {
      return d.name;
    }).distance(function (p) {
      if (p.distance) { return p.distance; } else { return 50; }
    }))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(component.width / 2, component.height / 2));

    const link = component.svg.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(component.data.links)
    .enter()
    .append('line')
    .attr('stroke-width', 2)
    .attr('stroke', baseLineColor);

    let selectedLines = null;

    component.svg.on('click', function(p) {
      d3.selectAll('line')
      .attr('stroke-width', 2)
      .attr('stroke', baseLineColor);

      component.legend.html(component.legendHtml(null));
    });

    const node = component.svg.append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(component.data.nodes)
    .enter()
    .append('circle')
    .attr('r', p => {
      return p.size || 8;
    })
    .attr('fill', function (p) {
      move(p);
      if (component.groupBy === 'landscape') {
        return Colors.landscapeColors[p.landscape];
      } else if (component.groupBy === 'alignment') {
        if (typeof p.alignment !== 'object') { return Colors.alignmentColors['None']; }
        const mainAlignment = p.alignment[0];
        if (mainAlignment) {
          return Colors.alignmentColors[mainAlignment];
        } else {
          return Colors.alignmentColors['None'];
        }
      } else if (component.groupBy === 'region') {
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
      if (axis === 'x') { return (mapCoord.charCodeAt(0) - 64) * 100; } else
      if (axis === 'y') { return (parseInt(mapCoord.slice(mapCoord.search('-') + 1, 4), 10)) * 100; }
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
    .on('zoom', zoomed));

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

      if (selectedLines) {
        selectedLines
        .attr('stroke-width', 2)
        .attr('stroke', baseLineColor);
      }

      const currCircle = this;
      selectedLines = d3.selectAll('line')
      .filter(function(line) {
        return getAttachedLinks(currCircle, line);
      })
      .attr('stroke-width', 3)
      .attr('stroke', highlightLineColor);

      component.legend.html(component.legendHtml(p));
    }
  }

  private legendHtml(p: ForceDirectedNode): string {
    let html = '';
    if (this.groupBy === 'landscape') {
      html += '<h5>Landscapes:</h5><ul>';
      for (const key in Colors.landscapeColors) {
        if (Colors.landscapeColors.hasOwnProperty(key)) {
          html += `<li style="color:${Colors.landscapeColors[key]};">${key}</li>`;
        }
      }
      html += '</ul>';
    }
    if (this.groupBy === 'alignment') {
      html += '<h5>Alignments:</h5><ul>';
      for (const key in Colors.alignmentColors) {
        if (Colors.alignmentColors.hasOwnProperty(key)) {
          html += `<li style="color:${Colors.landscapeColors[key]};">${key}</li>`;
        }
      }
      html += '</ul>';
    }
    if (!!p) {
      html += '<h5>Highlighted Planet:</h5>';
      html += '<div>';
      html += this.getPlanetTooltip(p);
      html += '<br/><i><small>Click anywhere on the map to deselect</small></i>';
      html += '</div>';
    }
    return html;
  }

  private getPlanetTooltip(p: ForceDirectedNode): string {
    let html = '';

    if (!!p.name) { html += '<b>' + p.name + '</b><br/>'; }
    if (!!p.region) { html += 'Region: ' + p.region; }
    if (!!p.sector) { html += '<br/>Sector: ' + p.sector; }
    if (!!p.system) { html += '<br/>System: ' + p.system; }
    if (!!p.capital) { html += '<br/>Capital: ' + p.capital; }
    if (!!p.landscape) { html += '<br/>Landscape: ' + p.landscape; }
    if (!!p.alignment && !!p.alignment.length) {
      html += '<br/>Alignment: ';
      p.alignment.forEach((group, index) => {
        html += group;
        if (index !== p.alignment.length - 1) { html += ', '; }
      });
    }
    if (!!p.inhabitants && !!p.inhabitants.length) {
      html += '<br/>Inhabitants: ';
      p.inhabitants.forEach((inhab, i) => {
        html += inhab;
        if (i != p.inhabitants.length - 1) { html += ', '; }
      });
    }
    if (!!p.coordinates) { html += '<br/>Coordinates: ' + p.coordinates; }
    return html;
  }

  public getDirections(p1, p2) {
    const sp = new ShortestHyperspaceLane(this.data.nodes, this.data.links, this.safe === 'true', this.alignment);
    if (!p1 || !p2) {
      this.growl('Invalid Planet', 'Please enter a valid planet name.', 3);
      return;
    }
    d3.selectAll('line').attr('stroke-width', 2)
    .attr('stroke', baseLineColor);
    let path = sp.findRoute(p1, p2);
    try {
      console.log(path);
      if (path.mesg !== 'OK') {
        throw new Error(path.mesg);
      }
      this.path = path;
      path = path.path;

      path.distance = this.findDistance(path);

      d3.selectAll('line')
        .filter(function(line) {
          for (let i = 0; i < path.length; i++) {
            if (line.id.includes(path[i].source) && line.id.includes(path[i].target)) {
              return true;
            }
          }
          return false;
        })
        .attr('stroke', mapLineColor);
      this.growl('Path Found', 'Distance: ' + path.distance, 5);
    } catch (e) {
      this.growl(_.capitalize(path.mesg), 'Unable to map from ' + p1 + ' to ' + p2, 3);
    }
  }

  private findDistance(path) {
    let dist = 0;
    if (typeof path === 'object' && !!path && path instanceof Array) {
      const arr = _.cloneDeep(this.data.links);
      path.forEach((p) => {
        dist += _.filter(arr, (link) => {
          return link.id.includes(p.source) && link.id.includes(p.target);
        })[0].distance;
      });
    }
    return dist;
  }

  private growl(summary: string, detail: string, time: number) {
    this.messages.push({severity: 'warning', summary: summary, detail: detail});
    setTimeout(() => {
      this.messages = _.drop(this.messages, 1);
    }, time * 1000);
  }
}
