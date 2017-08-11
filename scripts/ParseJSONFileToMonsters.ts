import express = require('express');
import * as fs from 'fs';
import * as _ from 'lodash';
import path = require('path');

import { Monster } from 'contracts/classes';

var filePath = path.join(__dirname, '.');

function doIt() {
  fs.readFile(__dirname + '5e-SRD-Monsters.json', 'utf8', (err, data) => {
    if(!!err) return err;
    var monsters = JSON.parse(data);
    monsters.forEach((m) => {
      var monster = Monster.SetMonsterFromSRD(m);
      fs.writeFileSync(__dirname + '/../data/monsters/srd/' + _.kebabCase(monster.name) + '.json', JSON.stringify(monster), 'utf8');
    })
  });
};

function makeOneFile() {
  console.log('Reading Files.');
  fs.readdir(__dirname + '/../data/monsters/srd', (err, monsters) => {
    console.log('Files Read.');
    if(!!err) {
      console.log(err);
      return;
    }
    var allMonsters = [];
    console.log('Starting Conversion.');
    monsters.forEach((m) => {
      var mon = JSON.parse(fs.readFileSync(__dirname + '/../data/monsters/srd/' + m, 'utf8'));
      mon.from = "srd";
      allMonsters.push(mon);
    });
    console.log('Conversion Complete.');
    fs.writeFileSync(__dirname + '/../data/monsters/all-srd.json', JSON.stringify(allMonsters), 'utf8');
    console.log('Done.');
  });
};

makeOneFile();
