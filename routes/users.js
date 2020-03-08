var express = require('express');
const bcrypt = require('bcrypt');
const { connect } = require('../modules/mysql');
const { alertLoc } = require('../modules/util');
const { isLogin, isLogout, isLog } = require('../modules/auth-chk');
var router = express.Router();

router.post('/join', isLog, async function (req, res, next) {
  let { username, email, userpw } = req.body;
  let sql, sqlVals, result, pugVals;
  sql = "SELECT email FROM user WHERE email=?";
  result = await connect.execute(sql, [email]);
  if (result[0][0]) {
    res.send(alertLoc('이미 가입된 이메일 입니다.', '/'));
  } else {
    userpw = await bcrypt.hash(userpw, 11); // 11번 재암호화
    sql = "INSERT INTO user SET email=?, username=?, userpw=?, api=?, api_id=?, created=now(), updated=now()"; // now() mysql 함수
    sqlVals = [email, username, userpw, 'local', ''];
    result = await connect.execute(sql, sqlVals);
    console.log(alertLoc('회원가입이 되었습니다.', '/'));
    res.send(alertLoc('회원가입이 되었습니다.', '/'));
  }
});

router.post('/login', isLog, async (req, res, next) => {
  let { email, userpw } = req.body;
  let sql, sqlVals, result;
  // userpw = await bcrypt.hash(userpw, 11); // method 1
  sql = "SELECT * FROM user WHERE email=?";
  result = await connect.execute(sql, [email]);
  if (result[0][0]) {
    let match = await bcrypt.compare(userpw, result[0][0].userpw); // method 2
    if (match) { // 암호일치 >> 로그인 성공
      res.send(alertLoc('로그인 성공', '/'));
    } else { // 불일치
      res.send(alertLoc('이메일/패스워드가 일치하지 않습니다.', '/'));
    }
  } else {
    res.send(alertLoc('이메일/패스워드가 일치하지 않습니다.', '/'));
  }
});

router.get('/logout', isLog, () => { // url과 콜백사이에 미들웨어 계속 넣을수있음

});

module.exports = router;