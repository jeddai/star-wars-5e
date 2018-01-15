import express = require('express');
import * as fs from 'fs';
import path = require('path');

import { GadgetsResponse } from 'contracts/responses';

var filePath = path.join(__dirname, '../data/gadgets');
var router = express.Router();

router.get('/get-gadgets', function (req, res) {
  var obj: GadgetsResponse = {
    Response: [],
    Error: null
  };
  obj.Response = JSON.parse(fs.readFileSync(filePath + '/all-gadgets.json', 'utf8'));
  obj.Response = obj.Response.sort((a, b) => {
    if(a.name < b.name) return -1;
    else if(a.name > b.name) return 1;
    else return 0;
  })
  return res.send(obj);
});

module.exports = router;
