const express =require('express');
const path=require('path');
const mysql=require('mysql');

const app=express();


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql",
    port:"3307",
    database: "nodejs"
  });



app.get('/login/google',(req,res)=>{
    
    con.connect((err)=>{ 
        if (err) throw err;
        console.log("Connected!");
        //login 처리하는 곳
        const b_time=req.body.b_time;
        var sql = `select * from members where b_time='${b_time}'`; //*는 모든 field를 다 가져왔다는 뜻
        con.query(sql, function (err, result) {
            if (err){
                console.log('login err');
                console.log(err);
                res.json({message:"선택 에러"})
            }else{
                if(result[0]){
                    console.log("login success");
                    req.session.email=email;
                    req.session.name=result[0].name;
                    req.session.m_no=result[0].no;
    
                    res.json({message:`${email}님이 시간선택에 성공하였습니다`});
                    
                    // const name=result[0].name;
                    // req.session.email=email;
                    // req.sessionm.name=name;
                    // con.end();
                    // res.json({message:`${name}님 로그인 성공`})
                }else{
                    console.log('no have bus sit');
                    res.json({message:"빈좌석이 없습니다"})
                }
            } 
            con.end();  
        });
    }); //end query
});

app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.listen(3000,()=>{
    console.log("server ready...");
});