const { alertLoc } = require('./util');
const isLogin = (req, res, next) => {
    // if (req.login) next();
    if (req.isAuthenticated()) next(); // passport
    else {
        res.send(alertLoc('정상적인 접근이 아닙니다.', '/'));
    }
}

const isLogout = (req, res, next) => {
    // if (!req.login) next();
    if (!req.isAuthenticated()) next(); // passport
    else res.send(alertLoc('정상적인 접근이 아닙니다.', '/'));
}

const isLog = (req, res, next) => {
    next();
}

module.exports = {
    isLogin,
    isLogout,
    isLog
};