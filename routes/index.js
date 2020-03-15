var express = require('express');
var router = express.Router();
var { connect } = require('../modules/mysql');
var { isLogin, isLogout } = require('../modules/auth-chk');

/* GET home page. */
router.get('/', async function (req, res, next) {
  console.log(req.user); // 패스포트에 의해서 세션에 들어가 있는 유저정보
  // 로그인전엔 undefined, 로그인되면 유저정보 들어있음
  // 쿠키는 id값만 있다. >> 크롬 개발자도구 Application에서 확인가능
  // req.app.locals.user = req.user;
  let sql, result;
  // sql = "SELECT * FROM post ORDER BY id DESC";
  // 아이디가 같은 user 테이블의 데이터를 합쳐서 가져와라. 조인문
  sql = "SELECT * FROM post LEFT JOIN user ON post.user_id = user.id ORDER BY post.id DESC";
  result = await connect.execute(sql);
  // res.render('index', { title: 'Express', user: req.user });
  res.render('index', { user: req.user, lists: result[0] });
});

module.exports = router;
