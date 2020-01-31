const express =require('express');
const path=require('path');
const mysql=require('mysql');

const app=express();

app.set('view engine','ejs');//use 보다 위에 set을 설정

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql",
    port:"3307",
    database: "nodejs"
});

app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.get('/login/google',(req,res)=>{
    
    con.connect((err)=>{ 
        // if (err) throw err;
        // console.log("Connected!");

        const b_time='03시';
        var sql = `select * from bus_time where b_time='${b_time}'`; //*는 모든 field를 다 가져왔다는 뜻
        con.query(sql, function (err, result) {
            if (err){
                console.log('login err');
                console.log(err);
                res.json({message:"선택 에러"});
            }else{
                console.log(result);
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
                }else{  }
            }
        }); //end query
        
    });
});


app.get('/test1',(req,res)=>{
    // con.connect((err)=>{ 
        // if (err) throw err;
        // console.log("Connected!");

        const sql = `select * from bus_position`; //*는 모든 field를 다 가져왔다는 뜻
        con.query(sql, function (err, result) {
            if (err){
                console.log('login err');
                console.log(err);
                res.json({message:"선택 에러"})
            }else{
                console.log(result);
                const sql = `select * from bus_time`; //*는 모든 field를 다 가져왔다는 뜻
                con.query(sql, function (err, result2) {
                    if (err){
                        console.log('login err');
                        console.log(err);
                        res.json({message:"선택 에러"})
                    }else{
                        let dataArray = [];
                        dataArray.push(result);
                        dataArray.push(result2);
                        console.log(dataArray);
                        res.render('test1',{dataArray:dataArray});
                    } 
                    // con.end();  
                });
    // }); //end query
            } 
            // con.end();  
        });
    // }); //end query
    
    
});


app.listen(3000,()=>{
    console.log("server ready...");
});