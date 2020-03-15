var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.user); // 패스포트에 의해서 세션에 들어가 있는 유저정보
  // 로그인전엔 undefined, 로그인되면 유저정보 들어있음
  // 쿠키는 id값만 있다. >> 크롬 개발자도구 Application에서 확인가능
  // req.app.locals.user = req.user;
  res.render('index', { title: 'Express', user: req.user });
});

module.exports = router;
