const express = require("express");   // express 모듈 요청
const app = express();
const port = 8080;        //사용할 포트 설정
const bodyParser = require('body-parser');  //body-parser 요청 
const config = require('./config/key');
const {User} = require("./models/User");   //User 요청

//어플리케이션 분석해서 가져와줌
app.use(bodyParser.urlencoded({extended: true}));
//어플리케이션 json형태를 분석해서 가져와줌
app.use(bodyParser.json());



const mongoose = require('mongoose');
mongoose.connect(config.mongoURI,{
    // useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:false
}).then(() => console.log('몽고 연결됨'))
    .catch(err => console.log(err))


app.get("/",(req,res)=>{res.send('됨? 노드몬!');});


// 회원가입을 위한 라우트
app.post("/register",(req,res) => {
    //회원가입 할때 필요한 정보들을 클라이언트에서 가져오면
    // 그것들을 db에 넣어준다.

    const user = new User(req.body)

    user.save((err,userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
});
app.get("/register",(req,res)=>{res.render('됨? 노드몬!');});


app.listen(port,()=>{
    console.log('서버실행 완료');

});

