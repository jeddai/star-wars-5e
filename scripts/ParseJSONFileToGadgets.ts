import express = require('express');
import * as fs from 'fs';
import * as _ from 'lodash';
import path = require('path');

import { Gadget } from '../src/app/classes/Gadget';

var filePath = path.join(__dirname, '../data/gadgets');

function makeManyFiles() {
  fs.readFile(__dirname + '/all-gadgets.json', 'utf8', (err, data) => {
    if(!!err) return err;
    var gadgets = JSON.parse(data);
    gadgets.forEach((g) => {
      var gadget = Gadget.MakeGadget(g);
      fs.writeFileSync(__dirname + _.kebabCase(gadget.name) + '.json', JSON.stringify(gadget), 'utf8');
    })
  });
};

function makeOneFile() {
  console.log('Reading Files.');
  fs.readdir(__dirname, (err, monsters) => {
    console.log('Files Read.');
    if(!!err) {
      console.log(err);
      return;
    }
    var allGadgets = [];
    console.log('Starting Conversion.');
    monsters.forEach((g) => {
      if(g === 'all-gadgets.json') return;
      var gadget = JSON.parse(fs.readFileSync(__dirname + '/' + g, 'utf8'));
      allGadgets.push(gadget);
    });
    console.log('Conversion Complete.');
    fs.writeFileSync(__dirname + '/all-gadgets.json', JSON.stringify(allGadgets), 'utf8');
    console.log('Done.');
  });
};

makeOneFile();