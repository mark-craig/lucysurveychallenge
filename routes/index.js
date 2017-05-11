var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:ref', function(req, res, next) {
  res.render('index', { title: 'Lucy Challenge', ref: req.params.ref});
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Lucy Challenge', ref: null});
});

module.exports = router;
