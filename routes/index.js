var express = require('express');
var router = express.Router();

var db = require('../queries');
var path = '/api/v1/'

router.get(path + 'joggersloggers', db.getAllUsers);
router.get(path + 'joggersloggers/:id', db.getSingleUser);
router.post(path + 'joggersloggers', db.createUser);
router.put(path + 'joggersloggers/:id', db.updateUser);
router.delete(path + 'joggersloggers/:id', db.removeUser);


module.exports = router;
