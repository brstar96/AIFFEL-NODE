var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async(req, res, next)=>{
  res.render('index', { title: 'Express' });
});


// 모든 사용자 대상 채팅
router.get('/chat', async(req, res, next)=>{
  res.render('chat.ejs', { title: 'Express' });
});

// 그룹 채팅
router.get('/groupchat', async(req, res, next)=>{
  res.render('groupchat.ejs', { title: 'Express' });
});

module.exports = router;
