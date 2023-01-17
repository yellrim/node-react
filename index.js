const express = require("express");   // express 모듈 요청
const app = express();
const port = 8080;        //사용할 포트 설정
const cookieParser = require('cookie-parser');  //cookie-parser 요청 
const config = require('./config/key');
const {auth} = require("./middleware/auth");
const {User} = require("./models/User");   //User 요청



app.use(express.json());  //json형태를 분석해서 가져와줌

app.use(cookieParser());



const mongoose = require('mongoose');
mongoose.connect(config.mongoURI,{
    // useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:false
}).then(() => console.log('몽고 연결됨'))
    .catch(err => console.log(err))


app.get("/",(req,res)=>{res.send('됨? 노드몬!');});


// 회원가입 라우트
app.post("/api/users/register",(req,res) => {
    //회원가입 할때 필요한 정보들을 클라이언트에서 가져오면
    // 그것들을 db에 넣어준다.

    const user = new User(req.body)

    user.save((err,userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        });
    });
});


// 로그인 라우트
app.post('/api/users/login',(req,res) => {
    //요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user){
            return res.json({
                loginSuccess: false,
                maessage: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        //요청된 이메일이 db에 있다면 비밀번호가 맞는지 확인
        user.comparePassword(req.body.password , (err, isMatch) => {
            if(!isMatch)
            return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})

            // 비밀번호가 맞다면 토근생성하기
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                // 쿠키에 토큰을 저장한다. 
                res.cookie("x_auth", user.token)
                .status(200)
                .json({loginSuccess: true, userId: user._id})
            })
        })
    })
})



app.get('/api/users/auth', auth, (req,res) => {
    // 여기 까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 Ture 라는 말
    res.status(200).json({
        _id: req.user.id,
        isAdmin: req.user.role === 0 ? false : true,    // role 0 = 일반유저 role 0이 아니면 관리자
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})


// 로그아웃 라우트
app.get('/api/users/logout', auth, (req,res) => {
    User.findOneAndUpdate({ _id: req.user._id },
        { token: "" }
        ,(err, user) => {
            if(err) return res.json({ success: false, err });
            return res.status(200).send({
                success: true
            })
        })
});


app.listen(port,()=>{
    console.log('서버실행 완료');

});

