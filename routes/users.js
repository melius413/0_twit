var express = require('express');
const bcrypt = require('bcrypt');
const { connect } = require('../modules/mysql');
const { alertLoc } = require('../modules/util');
const passport = require('passport');
const { isLogin, isLogout } = require('../modules/auth-chk');

const router = express.Router();

router.post('/join', isLogout, async function (req, res, next) {
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

router.post('/login', isLogout, async (req, res, next) => {
  /*
  // passport로 대체
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
  */

  // 여기서 미들웨어 실행가능
  // passport(index.js, local.js)의 done함수 작성
  const done = (err, user, msg) => {
    console.log(req.user); // 카카오 로그인된 사용자정보
    if (err) return next(err);
    if (!user) return res.send(alertLoc(msg, '/'));
    else {
      req.login(user, () => { // passport의 함수
        if (err) return next(err);
        else return res.send(alertLoc('로그인 되었습니다.', '/'));
      });
    }
  };
  // http://www.passportjs.org/docs/authenticate/ >> Custom Callback
  // (() => { })(req, res, next); // 즉시실행함수 (미들웨어 등록)
  passport.authenticate('local', done)(req, res, next); // 즉시실행함수 (미들웨어 등록)
  console.log(req.user); // 세션에 들어가 있는 유저정보
});

router.get('/logout', isLogin, (req, res, next) => { // url과 콜백사이에 미들웨어 계속 넣을수있음
  req.logout(); // 패스포트 메소드
  console.log(req.user); // 로그인 정보확인
  // req.session.destroy(); // 세션삭제 (세션을 지워야지 로그아웃됨??)

  // 카카오 로그아웃 문제
  // res.clearCookie(); // 카카오 로그아웃을 위해 쿠키까지 삭제필요?? 안됨
  // Kakao.Auth.logout(); // 로그아웃을 위해서 카카오 API 직접호출 필요 또는
  // https://developers.kakao.com/docs/restapi/user-management#%EB%A1%9C%EA%B7%B8%EC%95%84%EC%9B%83
  // curl -v -X POST https://kapi.kakao.com/v1/user/logout \
  // -H "Authorization: Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  // -H 는 헤더에 담에서 보내라
  // beforeSend 사용필요 >> 해당부분 프론트에서 처리

  req.app.locals.user = null; // 전역변수(locals) 사용시 초기화
  // res.redirect('/');
  res.redirect(alertLoc('로그아웃 되었습니다.', '/'));
});

router.post('/idchk', isLogout, async (req, res, next) => {
  let { email } = req.body;
  let sql, result;
  sql = "SELECT email FROM user WHERE email=?";
  result = await connect.execute(sql, [email]);
  if (result[0][0]) res.json({ result: false });
  else res.json({ result: true });
});

router.get('/kakao', passport.authenticate('kakao')); // 카카오 창 떠짐, kakao.js에 의해서 (요청)

router.get('/kakao/cb', passport.authenticate('kakao', {
  failureRedirect: '/'  // 실패시
}), (req, res) => {  // 성공시    
  res.redirect("/");
}); // 요청에 따른 응답

module.exports = router;