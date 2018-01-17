import express = require('express');
import * as fs from 'fs';
import * as _ from 'lodash';
import path = require('path');

import { Gadget } from '../src/app/_classes';

var filePath = path.join(__dirname, '../data/gadgets');

function makeManyFiles() {
  fs.readFile(filePath + '/all-gadgets.json', 'utf8', (err, data) => {
    if(!!err) {
      console.log(err);
      return err;
    }
    var gadgets = JSON.parse(data);
    gadgets.forEach((g) => {
      var gadget = Gadget.MakeGadget(g);
      fs.writeFileSync(filePath + '/' + _.kebabCase(gadget.name) + '.json', JSON.stringify(gadget), 'utf8');
    })
  });
};

function makeOneFile() {
  console.log('Reading Files.');
  fs.readdir(filePath, (err, gadgets) => {
    console.log('Files Read.');
    if(!!err) {
      console.log(err);
      return;
    }
    var allGadgets = [];
    console.log('Starting Conversion.');
    gadgets.forEach((g) => {
      if(g === 'all-gadgets.json') return;
      var gadget = JSON.parse(fs.readFileSync(filePath + '/' + g, 'utf8'));
      allGadgets.push(gadget);
    });
    console.log('Conversion Complete.');
    fs.writeFileSync(filePath + '/all-gadgets.json', JSON.stringify(allGadgets), 'utf8');
    console.log('Done.');
  });
};

makeOneFile();
