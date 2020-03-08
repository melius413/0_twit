var express = require('express');
const bcrypt = require('bcrypt');
const { connect } = require('../modules/mysql');
const { alertLoc } = require('../modules/util');
var router = express.Router();

router.post('/join', async function (req, res, next) {
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

module.exports = router;