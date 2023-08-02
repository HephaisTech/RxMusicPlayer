const express = require('express');
const { getVideoInfo, downloadchapter, savetoFavories, getMyFav, destroyFromFav } = require('../controller/extractorCtrl');
const Router = express.Router();

Router.post('/infoVidieo', getVideoInfo);
Router.post('/savefav', savetoFavories);
Router.post('/getfav', getMyFav);
Router.post('/delete', destroyFromFav);
Router.post('/downloadchapter', downloadchapter);// v0


module.exports = Router;