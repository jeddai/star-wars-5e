import express = require('express');
import * as fs from 'fs';
import path = require('path');

import { ForceDirectedGraphResponse } from '../src/app/_responses';
import { ForceDirectedGraphData, ForceDirectedLink, ForceDirectedNode } from '../src/app/_interfaces';

const filePath = path.join(__dirname, '../data');
const router = express.Router();

router.get('/data', (req, res, next) => {
  const fullPath: string = filePath + '/planets';
  const obj: ForceDirectedGraphData = {
    nodes: [],
    links: []
  };
  fs.readdir(fullPath, (err, planetFiles) => {
    obj.nodes = [];
    if (err) {
      return res.status(500).send(err);
    }
    planetFiles.forEach(function(f) {
      const planet = JSON.parse(fs.readFileSync(fullPath + '/' + f, 'utf8'));
      if (planet.active) {
        obj.nodes.push(<ForceDirectedNode>planet);
      }
    });
    obj.links = [];
    obj.links = obj.links.concat(createLinks(obj.nodes));
    return res.json(<ForceDirectedGraphResponse>{
      Response: obj,
      Error: !!err ? err.toString() : null
    });
  });
});

router.get('/planet/:name', (req, res, next) => {
  let planet = req.params.name.toLowerCase();
  if (planet.includes(' ')) {
    while (planet.includes(' ')) {
      planet = planet.replace(' ', '-');
    }
    planet = planet.replace('/', '-');
  }
  console.log(filePath + '/planets/' + planet + '.json');
  return res.json(<ForceDirectedNode>JSON.parse(fs.readFileSync(filePath + '/planets/' + planet + '.json', 'utf8')));
});

function createLinks(nodes) {
  const links = [];
  nodes.forEach((n) => {
    findAllMatching(links, nodes, n)
    .forEach((nm) => {
      links.push(<ForceDirectedLink>{
        'source': n.name,
        'target': nm.name,
        'distance': nm.distance,
        'id': n.name + ',' + nm.name
      });
    });
  });
  return links;
}

function findAllMatching(links, nodes, n) {
  let matching = [];
  if (typeof n.hyperspace === 'object') {
    n.hyperspace.forEach((hyp) => {
      nodes.forEach((node) => {
        if (node.name === hyp.planet &&
          n.name != node.name &&
          !containsDuplicate(links, n, node)) {
          node.distance = hyp.distance;
          matching.push(node);
        }
      });
    });
  }
  return matching;
}

function containsDuplicate(links, n, node) {
  let val = false;
  links.some((link) => {
    if ((link.source === n.name && link.target === node.name) ||
        (link.target === n.name && link.source === node.name)) {
      val = true;
      return true;
    }
  });
  return val;
}

module.exports = router;
