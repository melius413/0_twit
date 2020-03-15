const local = require('./local');
const { connect } = require('../modules/mysql');

module.exports = (passport) => {
    // 쿠키에서 id를 가져옮 (밑에 함수에서 유저데이터 가져옴)
    // 쿠키는 아이디만 가지고 있음
    passport.serializeUser((user, done) => {
        console.log(user);
        done(null, user.id); // cb
    });

    // 쿠키에서 받은 id를 이용해서 db에서 유저데이터를 가지고 옮
    // 유저정보를 req.user에 넣음
    passport.deserializeUser(async (id, done) => {
        let sql, result, user;
        sql = "SELECT * FROM user WHERE id=" + id;
        result = await connect.execute(sql);
        user = result[0][0];
        console.log(user);
        done(null, user);
        //sql
    });

    local(passport);
    // kakao(passport);
}