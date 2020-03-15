const express = require('express');
const router = express.Router();
const { connect } = require('../modules/mysql');
const { upload } = require('../modules/multer');
const { isLogin, isLogout } = require('../modules/auth-chk');

router.post('/save', isLogin, upload.single('img'), async (req, res, next) => {
  let sql, sqlVals, result, postId, tagId;
  let { content } = req.body;
  let img = req.file ? req.file.filename : '';
  let tags = content.match(/#[^\s]*/g); // 정규표현식
  sql = "INSERT INTO post SET content=?, img=?, user_id=?";
  sqlVals = [content, img, req.user.id]; // ???
  try {
    result = await connect.execute(sql, sqlVals);
  } catch (err) {
    console.log(err);
  }
  // res.json(result[0]);
  postId = result[0].insertId; // insertId는 생성된 레코드의 id값 반환
  if (tags) {
    for (let v of tags) {
      // 키값 중복제거, 먼저 필드를 primary key와 unique key로 등록 필요
      sql = "INSERT INTO tag SET title=? ON DUPLICATE KEY UPDATE updated=now()";
      result = await connect.execute(sql, [v.substr(1)]);
      tagId = result[0].insertId;
      sql = "INSERT INTO post_tag SET post_id=?, tag_id=?";
      result = await connect.execute(sql, [postId, tagId]);
    }
  }
  res.redirect('/');
});

module.exports = router;
