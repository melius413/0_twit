// http://www.passportjs.org/packages/passport-kakao/
const KakaoStrategy = require('passport-kakao').Strategy;
const { connect } = require('../modules/mysql');

const cb = async (accessToken, refreshToken, profile, done) => {
    console.log(profile); // 카카오에서 정보를 준다. 여기서 의미있는 정보를 따로 DB에 저장해야 한다.
    let sql, sqlVals = [], result;
    let user = {
        accessToken, // 카카오 로그아웃을 위해 담아둬야 한다.??
        username: profile.displayName,
        email: profile._json.kakao_account.email,
    }
    sql = "SELECT id FROM user WHERE api=? AND api_id=?";
    result = await connect.execute(sql, ['kakao', profile.id]);
    if (result[0][0]) { // 기존가입되어 있을때
        user.id = result[0][0].id;
        sql = "UPDATE user SET api_token=? WHERE id=?";
        result = await connect.execute(sql, [accessToken, user.id]);
    }
    else { // 신규로긴
        sql = "INSERT INTO user SET email=?, username=?, api=?, api_id=?, api_token=?";
        sqlVals = [
            profile._json.kakao_account.email ? profile._json.kakao_account.email : null,
            profile.username, 'kakao', profile.id, accessToken
        ];
        result = await connect.execute(sql, sqlVals);
    }
    done(null, user);
}

module.exports = (passport) => {
    passport.use(new KakaoStrategy({
        clientID: process.env.kakao,
        callbackURL: '/users/kakao/cb'
    }, cb));
};