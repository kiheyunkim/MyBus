const CommonRouter = require('express').Router();
const mysql = require('../controller/Mysql/Mysql');

CommonRouter.all('/*',(request,response,next)=>{            //이영역은 모든 접근이 세션이 인증 되어있어야함.
    if(request.session.passport === undefined){             //만료 판단
        if ((request.header('X-Requested-With') !== null && //Ajax로 온것인가.
        (request.header('X-Requested-With')).toLowerCase() === 'xmlhttprequest') ||
        request.header('ORIGIN') !== null){
            response.json({'message':'unAutherized'});
            return;
        }else{
            response.redirect('/');
            return;
        }
    }  
    
    next();
});

CommonRouter.get('/logout', (request, response)=>{
    request.logOut();
    request.session.destroy((err)=>{
        response.redirect(302,'/');
    })
});

CommonRouter.post('/RequestTime',(request,response)=>{
    mysql.GetSqlResult(`select date_format(departDate,'%Y-%m-%d') from buslist\
     GROUP BY departDate ORDER BY departDate ASC; `).then(
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
    mysql.GetSqlResult(`select * from buslist where \
    date_format(departDate,'%Y-%m-%d')=date_format('${requestDate}','%Y-%m-%d');`).then(
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
    );
})

CommonRouter.post('/RequestEmptySeat',(request,response)=>{
    let busNumber = request.body.busNum === undefined ? 0 : request.body.busNum;
    let selectedDate = request.body.selectDate;

    if(busNumber === 0 || selectedDate === ''){//버튼없이 누르는것 방지//2차 방식 //1차는 
        response.json({result:'invalidAccess'});
        return;
    }

    mysql.GetSqlResult(`SELECT busSeat FROM reservation WHERE busNumber = ${busNumber}\
    AND date_format(bus_date,'%Y-%m-%d') = date_format('${selectedDate}','%Y-%m-%d');`,[]).then(
        (outfulfilled)=>{
            request.session.selectDate = selectedDate;
            request.session.selectBusNum = busNumber;
            //예약된 busSeat만 가져옴
            let arr = Array.from(outfulfilled);
            let seat=[];
            for(let i=0;i<arr.length;++i){
                seat.push(arr[i]['busSeat']);
            }
            response.json({used:seat});
        }
    )
});

CommonRouter.post('/PrePurchase',(request,response)=>{
    //동작1 예약하는 자리들이 현재 사용중인지?

    //동작2 예약하는 자리들이 이미 예약 되어있는지?
    // 이미 예약되어있는 경우 예비 구매 테이블을 조사하고 구매테이블에서는 기존 소유자가 시간이 지났는지 확인(10분)

    //위의 동작 1과 동작 2에서 문제가 없을 경우에 
    let prePurchaseList = Array.from(request.body.selected);
    
    request.session.purchaseList = prePurchaseList;
    
    mysql.GetSqlResult(`SELECT * FROM reservation WHERE email = ? ;`,['123@123.com']).then(
        (outfulfilled)=>{
            console.log(outfulfilled);
        }
    )

    //고른 것과 상태 측정
    response.json({message: prePurchaseList, state : 'success'});
});


CommonRouter.post('/RequestReserv',(request,response)=>{
    mysql.GetSqlResult(`SELECT busNumber, busSeat, reserv_date \
    FROM Reservation WHERE email = ${request.session.passport.user[0].value}`).then(
        (outfulfilled)=>{
            console.log(outfulfilled);
        }
    )
});

CommonRouter.post('/Purchase',(request,response)=>{
    for(let i=0;i<prePurchaseList.length;++i){
        mysql.GetSqlResult(`INSERT INTO Reservation (email, busSeat, busNumber, bus_date) \
            VALUES ( ?, ${prePurchaseList}, ${request.session.selectBusNum}, \
            DATE('${request.session.selectDate}'));`
            ,['kiheyunkim@gmail.com']);
    } //$${request.session.passport.user[0].value}       //passport
});

module.exports = CommonRouter;