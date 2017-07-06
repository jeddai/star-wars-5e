import express = require('express');
import * as fs from 'fs';
import path = require('path');

import { MonsterResponse } from '../src/app/responses/MonsterResponse';
import { MonsterManualResponse } from '../src/app/responses/MonsterManualResponse';

var filePath = path.join(__dirname, '../data/monsters');
var router = express.Router();

console.log(__dirname);

router.get('/get-monster/:monster', function (req, res, next) {
  var obj: MonsterResponse = {
    Response: null,
    Error: null
  }
  fs.readFile(filePath + '/' + req.params.monster + '.json', 'utf8', (err, data) => {
    if(!!err) next(err);
    obj.Response = JSON.parse(data);
    return res.send(obj);
  });
});

router.get('/get-monsters', function (req, res) {
  var obj: MonsterManualResponse = {
    Response: [],
    Error: null
  };
  fs.readdir(filePath, (err, data) => {
    if (err) obj.Error = err.toString();
    data.forEach((monster) => {
      if(monster.includes('.json') && monster !== 'template.json') {
        obj.Response.push(JSON.parse(fs.readFileSync(filePath + '/' + monster, 'utf8')));
      }
    })
    return res.send(obj);
  });
});

module.exports = router;
