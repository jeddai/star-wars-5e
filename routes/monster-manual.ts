import express = require('express');
import * as fs from 'fs';
import path = require('path');

import { Monster } from 'contracts/classes';
import { MonsterResponse, MonsterManualResponse } from 'contracts/responses';

var filePath = path.join(__dirname, '../data/monsters');
var router = express.Router();

router.get('/get-monster/:monster', function (req, res, next) {
  var obj: MonsterResponse = {
    Response: null,
    Error: null
  }
  var file = {};
  try {
    file = fs.readFileSync(filePath + '/' + req.params.monster + '.json', 'utf8');
  } catch(e) {
    obj.Error = e;
    try {
      file = fs.readFileSync(filePath + '/srd/' + req.params.monster + '.json', 'utf8');
      obj.Error = null;
    } catch(e) { return res.status(404).send(obj); }
  }
  obj.Response = JSON.parse(<string>file);
  return res.send(obj);
});

router.get('/get-monsters', function (req, res) {
  var obj: MonsterManualResponse = {
    Response: [],
    Error: null
  };
  obj.Response = JSON.parse(fs.readFileSync(filePath + '/all-srd.json', 'utf8'));
  fs.readdir(filePath, (err, data) => {
    if (err) obj.Error = err.toString();
    data.forEach((monster) => {
      if(monster.includes('.json') && monster !== 'template.json' && monster !== 'all-srd.json') {
        try {
          obj.Response.push(JSON.parse(fs.readFileSync(filePath + '/' + monster, 'utf8')));
        } catch(e) {
          console.error(e, monster);
        }
      }
    });
    obj.Response.sort((a: Monster, b: Monster): number => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    })
    return res.send(obj);
  });
});

module.exports = router;
