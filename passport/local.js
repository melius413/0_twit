const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { connect } = require('../modules/mysql');

// passport/index의 done과 연결됨
async function cb(email, userpw, done) {
    let sql, result;
    sql = "SELECT * FROM user WHERE email=?";
    result = await connect.execute(sql, [email]);
    if (result[0][0]) {
        let match = await bcrypt.compare(userpw, result[0][0].userpw); // method 2
        if (match) { // 암호일치 >> 로그인 성공
            done(null, result[0][0]); // 에러없이 로긴 성공
        } else { // 불일치
            done(null, false, '이메일/패스워드가 일치하지 않습니다.'); // 에러없이 로긴 실패
        }
    } else done(null, false, '이메일/패스워드가 일치하지 않습니다.'); // 에러없이 로긴 실패
}

// http://www.passportjs.org/packages/passport-local/
// field명 변경시, field명 기입필요
const localStrategy = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: 'email', // req,body.email을 이용해서 알아서 로긴해줌.
        passwordField: 'userpw' // req,body.userpw를 이용해서 알아서 로긴해줌.
    }, cb));
}

module.exports = localStrategy;