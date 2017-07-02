import express = require('express');
import * as fs from 'fs';
import path = require('path');

import { DisciplineResponse } from '../src/app/force/DisciplineResponse';

var filePath = path.join(__dirname, '../data/force');
var router = express.Router();

console.log(__dirname);

router.get('/get-disciplines', function (req, res) {
  var fullPath = filePath + '/disciplines';
  var obj: DisciplineResponse = {
    Response: [],
    Error: null
  };
  fs.readdir(fullPath, (err, data) => {
    if (err) obj.Error = err.toString();
    data.forEach((discipline) => {
      if(discipline.includes('.json')) {
        var currDiscipline = JSON.parse(fs.readFileSync(fullPath + '/' + discipline, 'utf8'));
        currDiscipline.abilities.forEach((a) => {
          a.discipline = currDiscipline.name;
          a.order = currDiscipline.order;
        });
        obj.Response.push(currDiscipline);
      }
    })
    return res.send(obj);
  });
});

module.exports = router;
