const CommonRouter = require('express').Router();
const mysql = require('../controller/Mysql/Mysql');

CommonRouter.all('/*',(request,response,next)=>{    //이영역은 모든 접근이 세션이 인증 되어있어야함.
    /*
    if(request.session.passport === undefined){     //만료 판단
        if ((request.header('X-Requested-With') !== null &&      //Ajax로 온것인가.
        (request.header('X-Requested-With')).toLowerCase() === 'xmlhttprequest') ||
        request.header('ORIGIN') !== null){
            response.json({'message':'unAutherized'});
            return;
        }else{
            response.redirect('/');
            return;
        }
    }
    */
    next();
})

CommonRouter.get('/logout', (request, response)=>{
    request.logOut();
    request.session.destroy((err)=>{
        response.redirect(302,'/');
    })
});

CommonRouter.post('/RequestTime',(request,response)=>{
    mysql.GetSqlResult(`select date_format(departDate,'%Y-%m-%d') from buslist GROUP BY departDate ORDER BY departDate ASC; `).then(
        (outfulfilled)=>{
            let arr = Array.from(outfulfilled);
            let times = [];
            for(let i=0;i<arr.length;++i){
                times.push(arr[i][`date_format(departDate,'%Y-%m-%d')`]);
            }

            response.json({times:times});
        }   
    )
});

CommonRouter.post('/RequestBusList',(request,response)=>{
    let requestDate = request.body.request;
    mysql.GetSqlResult(`select * from buslist where date_format(departDate,'%Y-%m-%d')=date_format('${requestDate}','%Y-%m-%d');`).then(
        (outfulfilled)=>{
            let arr = Array.from(outfulfilled);
            let results = [];
            for(let i=0;i<arr.length;++i){
                let busNum = arr[i].busNumber;
                let leftSeat = arr[i].seatUsed;
                results.push({busNum,leftSeat});
            }

            response.json({buses:results});
        }
    )
})

CommonRouter.post('/RequestEmptySeat',(request,response)=>{
    mysql.GetSqlResult(`SELECT busSeat FROM reservation WHERE busNumber = ${request.body.busNum }\
     AND date_format(reserv_date,'%Y-%m-%d') = date_format('${request.body.selectDate}','%Y-%m-%d');`).then(
        (outfulfilled)=>{
            request.session.selectDate = request.body.selectDate;
            request.session.selectBusNum = request.body.busNum;
            //예약된 busSeat만 가져옴
            let arr = Array.from(outfulfilled);
            let seat=[];
            for(let i=0;i<arr.length;++i){
                seat.push(arr[i]['busSeat']);
            }
            
            console.log(seat);
            response.json({used:seat});
        }
    )
})


CommonRouter.get('/RequestReserv',(request,response)=>{
    mysql.GetSqlResult(`SELECT busNumber, busSeat, reserv_date FROM Reservation WHERE email = ${request.session.passport.user.email}`).then(
        (outfulfilled)=>{
            console.log(outfulfilled);

        }
    )
})

CommonRouter.get('/purchase',(request,response)=>{
    //mysql.
})

module.exports = CommonRouter;