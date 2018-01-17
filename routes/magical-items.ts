import express = require('express');
import * as fs from 'fs';
import path = require('path');

import { MagicalItemResponse } from '../src/app/_responses';

var filePath = path.join(__dirname, '../data/magical-items');
var router = express.Router();

router.get('/get-magical-items', function (req, res) {
  var obj: MagicalItemResponse = {
    Response: [],
    Error: null
  };
  fs.readdir(filePath, (err, data) => {
    if (err) obj.Error = err.toString();
    data.forEach((item) => {
      if(item.includes('.json') && item !== 'template.json') {
        obj.Response.push(JSON.parse(fs.readFileSync(filePath + '/' + item, 'utf8')));
      }
    })
    return res.send(obj);
  });
});

module.exports = router;
