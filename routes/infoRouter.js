const express = require('express');
const { getVideoInfo, downloadchapter } = require('../controller/extractorCtrl');
const Router = express.Router();

Router.post('/infoVidieo', getVideoInfo);
Router.post('/downloadchapter', downloadchapter);

module.exports = Router;